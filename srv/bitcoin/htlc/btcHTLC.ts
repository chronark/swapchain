import * as bitcoin from "bitcoinjs-lib"
import fetch from "node-fetch"
import { PsbtInput } from "bip174/src/lib/interfaces"
import { witnessStackToScriptWitness } from "./witnessStack"
import { Secret } from "../../../pkg/secret/secret"

/**
 * Contains all necessary information to create an HTLC on Bitcoin blockchain
 *
 * @interface HTLCConfigBTC
 */
interface HTLCConfigBTC {
  /**
   * The transaction id from the preceeding transaction.
   *
   * @memberof HTLCConfigBTC
   */
  transactionID: string

  /**
   * The amount of satoshi to exchange.
   *
   * @memberof HTLCConfigBTC
   */
  amount: number

  /**
   * How many blocks need to be mined before refund is possible.
   *
   * @memberof HTLCConfigBTC
   */
  sequence: number

  /**
   * SHA256 hash of the secret.
   *
   * @memberof HTLCConfigBTC
   */
  hash: Buffer
}

/**
 * This is a subset of a real transaction but we do not require the rest yet.
 *
 * @interface Transaction
 */
interface Transaction {
  hash: string
  hex: string
  block_height: number
  input: {
    witness: string[]
  }[]
  outputs: {
    value: number
    addresses: string[]
  }[]
}

export interface TransactionBlockstream {
  txid: string
  vin: {
    txid: string
    vout: number
    prevout: {
      scriptpubkey_address: string
      value: number
    }
    witness: string[]
  }[]
  vout: {
    scriptpubkey_type: string
    scriptpubkey_address: string
    value: number
  }[]
  status: {
    block_height: number
  }
}

export default class BitcoinHTLC {
  private network: bitcoin.Network
  private receiver: bitcoin.ECPairInterface
  private sender: bitcoin.ECPairInterface
  private fundingTxBlockHeight: number
  private preimage: string
  private amountAfterFees: number
  private keepLooking: boolean
  /**
   * Creates an instance of BitcoinHTLC.
   *
   * @memberof BitcoinHTLC
   * @param network - mainnet, testnet, or regtest.
   * @param sender - Sender keypair.
   * @param receiver - Receiver keypair.
   */
  constructor(
    network: bitcoin.Network = bitcoin.networks.testnet,
    sender: bitcoin.ECPairInterface,
    receiver: bitcoin.ECPairInterface,
  ) {
    this.network = network
    this.sender = sender
    this.receiver = receiver
    this.fundingTxBlockHeight = -1
    this.preimage = ""
    this.amountAfterFees = 0
    this.keepLooking = true
  }

  public getFundingTxBlockHeight(): number {
    return this.fundingTxBlockHeight
  }

  /**
   * Stops looking for matching HTLC.
   */
  public stopLooking(): void {
    this.keepLooking = false
  }

  /**
   * Create the redeem script in bitcoin's scripting language.
   *
   * @private
   * @param hash - SHA256 hash of the secret.
   * @param sequence - How many blocks need to be mined before refund is possible.
   * @returns  A bitcoin script.
   * @memberof BitcoinHTLC
   */
  private redeemScript(hash: Buffer, sequence: number): Buffer {
    return bitcoin.script.compile([
      bitcoin.opcodes.OP_IF,
      bitcoin.opcodes.OP_SHA256,
      hash,
      bitcoin.opcodes.OP_EQUALVERIFY,
      this.receiver.publicKey,
      bitcoin.opcodes.OP_CHECKSIG,
      bitcoin.opcodes.OP_ELSE,
      bitcoin.script.number.encode(sequence),
      bitcoin.opcodes.OP_CHECKSEQUENCEVERIFY,
      bitcoin.opcodes.OP_DROP,
      this.sender.publicKey,
      bitcoin.opcodes.OP_CHECKSIG,
      bitcoin.opcodes.OP_ENDIF,
    ])
  }

  /**
   * Finalize an HTLC refund transaction using PSBT.
   *
   * @param inputIndex - The index in the input array.
   * @param input - The array of transaction inputs.
   * @param script - P2WSH redeemscript.
   * @param isSegwit - Included only for bitcoinjs-lib compatible reasons.
   * @param isP2SH - Included only for bitcoinjs-lib compatible reasons.
   * @param isP2WSH - Included only for bitcoinjs-lib compatible reasons.
   * @returns A function to finalize and serialize the scripts.
   */
  private getFinalScriptsRefund = (
    inputIndex: number,
    input: PsbtInput,
    script: Buffer,
    isSegwit: boolean,
    isP2SH: boolean,
    isP2WSH: boolean,
  ): { finalScriptSig: Buffer | undefined; finalScriptWitness: Buffer | undefined } => {
    // TODO
    // Step 1: Check to make sure the meaningful script matches what you expect.
    const decompiled = bitcoin.script.decompile(script)
    // Checking if first OP is OP_IF... should do better check in production!
    // You may even want to check the public keys in the script against a
    // whitelist depending on the circumstances!!!
    // You also want to check the contents of the input to see if you have enough
    // info to actually construct the scriptSig and Witnesses.
    if (!decompiled || decompiled[0] !== bitcoin.opcodes.OP_IF) {
      throw new Error(`Can not finalize input #${inputIndex}`)
    }

    const payment = bitcoin.payments.p2wsh({
      network: this.network,
      redeem: {
        output: script,
        input: bitcoin.script.compile([input.partialSig![0].signature, bitcoin.opcodes.OP_FALSE]),
      },
    })

    if (!payment.witness || payment.witness.length === 0) {
      throw new Error("Witness undefined.")
    }

    return {
      finalScriptSig: undefined,
      finalScriptWitness: witnessStackToScriptWitness(payment.witness),
    }
  }

  /**
   * Finalize an HTLC redeem transaction using PSBT.
   *
   * @param inputIndex - The index in the input array.
   * @param input - The array of transaction inputs.
   * @param script - P2WSH redeemscript.
   * @param isSegwit - Included only for bitcoinjs-lib compatible reasons.
   * @param isP2SH - Included only for bitcoinjs-lib compatible reasons.
   * @param isP2WSH - Included only for bitcoinjs-lib compatible reasons.
   * @returns A function to finalize and serialize the scripts.
   */
  private getFinalScriptsRedeem = (
    inputIndex: number,
    input: PsbtInput,
    script: Buffer,
    isSegwit: boolean,
    isP2SH: boolean,
    isP2WSH: boolean,
  ): { finalScriptSig: Buffer | undefined; finalScriptWitness: Buffer | undefined } => {
    // TODO
    // Step 1: Check to make sure the meaningful script matches what you expect.
    const decompiled = bitcoin.script.decompile(script)
    // Checking if first OP is OP_IF... should do better check in production!
    // You may even want to check the public keys in the script against a
    // whitelist depending on the circumstances!!!
    // You also want to check the contents of the input to see if you have enough
    // info to actually construct the scriptSig and Witnesses.
    if (!decompiled || decompiled[0] !== bitcoin.opcodes.OP_IF) {
      throw new Error(`Can not finalize input #${inputIndex}`)
    }

    const payment = bitcoin.payments.p2wsh({
      network: this.network,
      redeem: {
        output: script,
        input: bitcoin.script.compile([
          input.partialSig![0].signature,
          Buffer.from(this.preimage),
          bitcoin.opcodes.OP_TRUE,
        ]),
      },
    })

    if (!payment.witness || payment.witness.length === 0) {
      throw new Error("Witness undefined.")
    }

    return {
      finalScriptSig: undefined,
      finalScriptWitness: witnessStackToScriptWitness(payment.witness),
    }
  }

  /**
   * Helperfunction to get the public key from an ECPair
   *
   * @private
   * @param  keyPair - A keyPair initialized as ECPair.
   * @returns A p2wpkh object.
   * @memberof BitcoinHTLC
   */
  private getWitnessPublicKeyHash(keyPair: bitcoin.ECPairInterface): bitcoin.payments.Payment {
    // TODO
    return bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: this.network })
  }

  /**
   * Get the current confirmed balance from a transaction.
   * The output of the transaction must not be spent yet.
   *
   * @private
   * @param address - A public key hash address.
   * @param transactionID - The unique identifier for a transaction.
   * @returns The current confirmed balance.
   * @memberof BitcoinHTLC
   */
  private async getBalance(address: string, transactionID: string): Promise<number> {
    const tx = await this.getTransactionByID(transactionID)

    return tx.outputs.filter((output) => {
      return output.addresses[0] === address
    })[0].value
  }

  /**
   * Calculate the p2wsh to send our money to before creating the timelock refund operation.
   *
   * @public
   * @param hash - SHA256 hash of the secret.
   * @param sequence - How many blocks need to be mined before refund is possible.
   * @returns The pay-to-scripthash object.
   * @memberof BitcoinHTLC
   */
  public getP2WSH(hash: Buffer, sequence: number): bitcoin.Payment {
    return bitcoin.payments.p2wsh({
      redeem: {
        output: this.redeemScript(hash, sequence),
      },
      network: this.network,
    })
  }

  /**
   * Send funds to a pay2witnessScripthash address to be used in the timelock refund operation.
   *
   * @private
   * @param p2wsh - Pay-to-witness-script-hash object.
   * @param transactionID - A Transaction id with unspent funds.
   * @param amount - The amount of satoshi to exchange.
   * @returns The hex-coded transaction. This needs to be pushed to the chain using `this.pushTX`
   * @memberof BitcoinHTLC
   */
  private async sendToP2WSHAddress(p2wsh: bitcoin.Payment, transactionID: string, amount: number): Promise<string> {
    const p2wpkFromSender = this.getWitnessPublicKeyHash(this.sender)
    const balance = await this.getBalance(p2wpkFromSender.address!, transactionID)
    const amountToKeep = balance - amount

    // If output of the transaction ID given does not have sufficient balance
    if (amountToKeep < 0) {
      return ""
    }

    this.amountAfterFees = amount - 200 // TODO: Add option for higher and lower fees

    const outputs =
      amountToKeep > 0
        ? [
            {
              address: p2wpkFromSender.address!,
              value: amountToKeep,
            },
            {
              address: p2wsh.address!,
              value: this.amountAfterFees,
            },
          ]
        : [
            {
              address: p2wsh.address!,
              value: this.amountAfterFees,
            },
          ]
    const { vout, witnessUtxo } = await this.getWitnessUtxo(transactionID, p2wpkFromSender)

    const psbt = new bitcoin.Psbt({ network: this.network })
      .setVersion(2)
      .addInput({
        hash: transactionID,
        index: vout,
        witnessUtxo,
      })
      .addOutputs(outputs)
      .signInput(0, this.sender)

    psbt.validateSignaturesOfInput(0)
    psbt.finalizeAllInputs()
    return psbt.extractTransaction().toHex()
  }

  /**
   * Pushes a transaction hex to the blockchain. Return empty string in case of failure
   *
   * @private
   * @param hex - A transaction encoded as hex.
   * @returns The transactionID of the pushed transaction or empty string caused by a failure.
   * @memberof BitcoinHTLC
   */
  private async pushTX(hex: string): Promise<string> {
    const res = await fetch("https://testnet-api.smartbit.com.au/v1/blockchain/pushtx", {
      method: "POST",
      body: JSON.stringify({ hex }),
    }).then((res) => res.json())
    if (!res.success) {
      return ""
    }
    return res.txid
  }

  /**
   * Fetch a transaction by its id from public api.
   *
   * @private
   * @param transactionID - Unique hash identifier for a transaction.
   * @returns Transaction object.
   * @memberof BitcoinHTLC
   */
  private async getTransactionByID(transactionID: string): Promise<Transaction> {
    return fetch(
      `https://api.blockcypher.com/v1/btc/test3/txs/${transactionID}?limit=50&includeHex=true&token=43d0d9427875480da8ada45851bf0da6`,
    ).then((res) => res.json())
  }

  /**
   * Fetch a transaction by its address from public api.
   *
   * @param address - The address to look for transactions for.
   * @param out - A flag to look for transactions were the address is in the output (if set to true) or input (if set to false).
   * @returns TransactionBlockstream object.
   * @memberof BitcoinHTLC
   */
  public async getTransactionByAddress(address: string, out: boolean): Promise<TransactionBlockstream> {
    let tx = []

    while (this.keepLooking && tx.length < 1) {
      const txs = await fetch(`https://blockstream.info/testnet/api/address/${address}/txs`).then((res) => res.json())

      /* eslint-disable @typescript-eslint/no-explicit-any */
      tx = txs.filter((element: any) => {
        if (out) {
          return (
            element.vout.filter((subElement: any) => {
              return subElement.scriptpubkey_address === address
            }).length > 0
          )
        } else {
          return (
            element.vin.filter((subElement: any) => {
              return subElement.prevout.scriptpubkey_address === address
            }).length > 0
          )
        }
      })
      /* eslint-enable @typescript-eslint/no-explicit-any */

      await new Promise((resolve) => setTimeout(resolve, 5000)) // TODO: Set appropriate Timer
    }
    // If there are multiple transactions, return the latest
    return tx[0]
  }

  /**
   * Return vout and nonWitnessUtxo.
   *
   * @private
   * @param transactionID - Transaction id you want to use.
   * @param target - p2wsh or p2wpk.
   * @returns vout and witnessUtxo.
   * @memberof BitcoinHTLC
   */
  private async getWitnessUtxo(
    transactionID: string,
    target: bitcoin.payments.Payment,
  ): Promise<{ vout: number; witnessUtxo: { script: Buffer; value: number } }> {
    const tx = await this.getTransactionByID(transactionID)
    let vout = -1
    for (let i = 0; i < tx.outputs.length; i++) {
      if (tx.outputs[i].addresses.includes(target.address!)) {
        vout = i
        break
      }
    }

    if (vout < 0) {
      throw new Error("Could not find vout")
    }

    const witnessUtxo = {
      script: target.output!,
      value: tx.outputs[vout].value,
    }

    return {
      vout,
      witnessUtxo,
    }
  }

  /**
   * Redeems an HTLC.
   *
   * @param p2wsh - The Pay-to-witness-script-hash object to redeem.
   * @param secret - The secret object with the correct preimage inside.
   * @returns A status code. Can be used for user feedback.
   * @memberof BitcoinHTLC
   */
  public async redeem(p2wsh: bitcoin.Payment, secret: Secret): Promise<number> {
    // Save preimage as attribute to inject it into the getFinalScriptsRedeem method
    this.preimage = secret.preimage!

    const tx = await this.getTransactionByAddress(p2wsh.address!, true)

    // The HTLC output is always the only or the second array entry
    const amount = tx.vout.length > 1 ? tx.vout[1].value : tx.vout[0].value

    // TODO: Check if amount is enough!
    this.amountAfterFees = amount - 200
    const redeemHex = await this.getRedeemHex(tx.txid, p2wsh)
    const redeemTransaction = await this.pushTX(redeemHex)

    if (!redeemTransaction) {
      console.log("Hex for redeem transaction: " + redeemHex)
      // Error pushing redeemHex to endpoint.
      return 1
    }

    return 0
  }

  /**
   * Creates an HTLC.
   *
   * @param config - Configuration object for the HTLC.
   * @returns A status code. Can be used for user feedback.
   * @memberof BitcoinHTLC
   */
  public async create(config: HTLCConfigBTC): Promise<number> {
    const { transactionID, amount, sequence, hash } = config

    const p2wsh = this.getP2WSH(hash, sequence)

    // Funding
    const p2wpkHex = await this.sendToP2WSHAddress(p2wsh, transactionID, amount)

    if (!p2wpkHex) {
      // The output of the transaction ID given does not have sufficient balance.
      return 1
    }
    const fundingTransactionID = await this.pushTX(p2wpkHex)

    if (!fundingTransactionID) {
      // Error during pushing funding transaction.
      return 2
    }

    // Wait for the transaction to be broadcasted
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Substract second fee
    this.amountAfterFees = this.amountAfterFees - 200 // TODO: Add fee option

    // Refunding
    const refundHex = await this.getRefundHex(fundingTransactionID, sequence, p2wsh)
    console.log("refundHex: " + refundHex)

    while (this.fundingTxBlockHeight === -1) {
      this.fundingTxBlockHeight = (await this.getTransactionByID(fundingTransactionID)).block_height
      await new Promise((resolve) => setTimeout(resolve, 10_000))
    }
    /*
    const payload = { hex: refundHex, validAfterBlockHeight: this.fundingTxBlockHeight + sequence }
    const res = await fetch("http://localhost:13000", { method: "POST", body: JSON.stringify(payload) }).then((res) =>
      res.json(),
    )

    if (!res.success) {
      console.log("Hex for refund transaction: " + refundHex)
      // Error posting refundHex to database.
      return 3
    }
    */
    return 0 // res.success
  }

  /**
   * Refunds the HTLC to sender.
   *
   * @param transactionID - The transaction id from the funding transaction.
   * @param sequence - The timelock as number of blocks.
   * @param p2wsh - Pay-to-witness-script-hash object.
   * @returns A refund hex.
   * @memberof BitcoinHTLC
   */
  private async getRefundHex(
    transactionID: string,
    sequence: number,
    p2wsh: bitcoin.payments.Payment,
  ): Promise<string> {
    const { vout, witnessUtxo } = await this.getWitnessUtxo(transactionID, p2wsh)

    const psbt = new bitcoin.Psbt({ network: this.network })
      .setVersion(2)
      .addInput({
        hash: transactionID,
        index: vout,
        sequence: sequence,
        witnessUtxo,
        witnessScript: p2wsh.redeem!.output!,
      })
      .addOutput({
        address: this.getWitnessPublicKeyHash(this.sender).address!,
        value: this.amountAfterFees,
      })
      .signInput(0, this.sender)
      .finalizeInput(0, this.getFinalScriptsRefund)

    return psbt.extractTransaction().toHex()
  }

  /**
   * Redeems the HTLC.
   *
   * @param transactionID - The transaction id from the funding transaction.
   * @param p2wsh - Pay-to-witness-script-hash object.
   * @returns A redeem hex.
   * @memberof BitcoinHTLC
   */
  private async getRedeemHex(transactionID: string, p2wsh: bitcoin.payments.Payment): Promise<string> {
    const { vout, witnessUtxo } = await this.getWitnessUtxo(transactionID, p2wsh)

    const psbt = new bitcoin.Psbt({ network: this.network })
      .setVersion(2)
      .addInput({
        hash: transactionID,
        index: vout,
        witnessUtxo,
        witnessScript: p2wsh.redeem!.output!,
      })
      .addOutput({
        address: this.getWitnessPublicKeyHash(this.receiver).address!,
        value: this.amountAfterFees,
      })
      .signInput(0, this.receiver)
      .finalizeInput(0, this.getFinalScriptsRedeem)

    return psbt.extractTransaction().toHex()
  }
}
