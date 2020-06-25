import * as bitcoin from "bitcoinjs-lib"
import fetch from "node-fetch"
import { Secret } from "../../secret/secret"
import { PsbtInput } from "bip174/src/lib/interfaces"
import { witnessStackToScriptWitness } from "./witnessStack"
import { BitcoinAPI } from "../../types/bitcoinApi"

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

/**
 * Handler to create HTLCs on the bitcoin blockchain.
 *
 * @param inputIndex
 * @param input
 * @param script
 * @param isSegwit
 * @param isP2SH
 * @param isP2WSH
 */
export default class BitcoinHTLC {
  private amount: number
  private fee: number
  private network: bitcoin.Network
  private receiver: bitcoin.ECPairInterface
  private secret: Secret
  private sender: bitcoin.ECPairInterface
  private sequence: number
  /**
   * Creates an instance of BitcoinHTLC.
   *
   * @memberof BitcoinHTLC
   * @param fee - The fee to leave behind on every transaction. In Satoshis.
   * @param network - mainnet, testnet, or regtest.
   * @param secret - The secret to redeem the HTLC.
   * @param sequence - How many blocks need to be mined before Alice can refund the time lock.
   * @param sender - Sender keypair.
   * @param receiver - Receiver keypair.
   * @param amount - The amount of satoshi to exchange.
   */
  constructor(
    fee = 1_000,
    network: bitcoin.Network = bitcoin.networks.testnet,
    secret: Secret,
    sequence: number,
    sender: bitcoin.ECPairInterface,
    receiver: bitcoin.ECPairInterface,
    amount: number,
  ) {
    this.fee = fee
    this.network = network
    this.secret = secret
    this.sequence = sequence
    this.sender = sender
    this.receiver = receiver
    this.amount = amount

    if (!process.env.BLOCKCYPHER_API_TOKEN || process.env.BLOCKCYPHER_API_TOKEN.length === 0) {
      throw new ReferenceError("Could not load BLOCKCYPHER_API_TOKEN from environment")
    }
  }

  /**
   * Create the redeem script in bitcoin's scripting language.
   *
   * @private
   * @returns  A bitcoin script.
   * @memberof BitcoinHTLC
   */
  private redeemScript(): Buffer {
    return bitcoin.script.compile([
      bitcoin.opcodes.OP_IF,
      bitcoin.opcodes.OP_SHA256,
      this.secret.hash,
      bitcoin.opcodes.OP_EQUALVERIFY,
      this.receiver.publicKey,
      bitcoin.opcodes.OP_CHECKSIG,
      bitcoin.opcodes.OP_ELSE,
      bitcoin.script.number.encode(this.sequence),
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
          Buffer.from(this.secret.preimage),
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
   * @param address - Same as publicKey.
   * @param transactionID - The unique identifier for a transaction.
   * @returns The current confirmed balance.
   */
  private async getBalance(address: string, transactionID: string): Promise<number> {
    const tx = await this.getTransaction(transactionID)

    return tx.outputs.filter((output) => {
      return output.addresses[0] === address
    })[0].value
  }

  /**
   * Calculate the p2wsh to send our money to before creating the timelock refund operation.
   *
   * @private
   * @returns The pay-to-scripthash object.
   * @memberof BitcoinHTLC
   */
  private getP2WSH(): bitcoin.Payment {
    return bitcoin.payments.p2wsh({
      redeem: {
        output: this.redeemScript(),
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
   * @returns The hex-coded transaction. This needs to be pushed to the chain using `this.pushTX`
   * @memberof BitcoinHTLC
   */
  private async sendToP2WSHAddress(p2wsh: bitcoin.Payment, transactionID: string): Promise<string> {
    const p2wpkFromSender = this.getWitnessPublicKeyHash(this.sender)
    const balance = await this.getBalance(p2wpkFromSender.address!, transactionID)
    const amountToKeep = balance - this.amount - this.fee

    const outputs = [
      {
        address: p2wpkFromSender.address!,
        value: amountToKeep,
      },
      {
        address: p2wsh.address!,
        value: this.amount,
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
   * Fetch a transaction from public api.
   *
   * @private
   * @param transactionID - Unique hash identifier for a transaction.
   * @returns Transaction object.
   * @memberof BitcoinHTLC
   */
  private async getTransaction(transactionID: string): Promise<Transaction> {
    return fetch(
      `https://api.blockcypher.com/v1/btc/test3/txs/${transactionID}?limit=50&includeHex=true&token=${process.env.BLOCKCYPHER_API_TOKEN}`,
    ).then((res) => res.json())
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
    const tx = await this.getTransaction(transactionID)
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
   * Creates an HTLC.
   *
   * @param  transactionID - The transaction id from the preceeding transaction.
   * @returns Hex-coded transaction to be published to the chain.
   * @memberof BitcoinHTLC
   */
  public async create(transactionID: string): Promise<void> {
    const p2wsh = this.getP2WSH()

    // Funding
    const p2wpkHex = await this.sendToP2WSHAddress(p2wsh, transactionID)
    const fundingTransactionID = await this.pushTX(p2wpkHex)

    // Wait for the transaction to be broadcasted
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redeeming
    // const redeemHex = await this.getRedeemHex(fundingTransactionID, p2wsh)
    const redeemTransaction = "" // await this.pushTX(redeemHex)

    // No reason to create a refund transaction if bob already redeemed the funds
    if (redeemTransaction.length > 0) {
      return
    }

    // Refunding
    const refundHex = await this.getRefundHex(fundingTransactionID, p2wsh)
    const blockHeight = (await this.getTransaction(fundingTransactionID)).block_height

    const payload = { hex: refundHex, validAfterBlockHeight: blockHeight + this.sequence }
    const res = await fetch("http://localhost:13000", { method: "POST", body: JSON.stringify(payload) }).then((res) =>
      res.json(),
    )

    if (!res.success) {
      console.error("Error posting refundHex to database.")
      console.log("Hex for refund transaction: " + refundHex)
      // TODO: Notify user in UI
    }
  }

  /**
   * Refunds the HTLC to sender.
   *
   * @param transactionID - The transaction id from the funding transaction.
   * @param p2wsh - Pay-to-witness-script-hash object.
   */
  private async getRefundHex(transactionID: string, p2wsh: bitcoin.payments.Payment): Promise<string> {
    const { vout, witnessUtxo } = await this.getWitnessUtxo(transactionID, p2wsh)

    const psbt = new bitcoin.Psbt({ network: this.network })
      .setVersion(2)
      .addInput({
        hash: transactionID,
        index: vout,
        sequence: this.sequence,
        witnessUtxo,
        witnessScript: p2wsh.redeem!.output!,
      })
      .addOutput({
        address: this.getWitnessPublicKeyHash(this.sender).address!,
        value: this.amount - this.fee,
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
        value: this.amount - this.fee,
      })
      .signInput(0, this.receiver)
      .finalizeInput(0, this.getFinalScriptsRedeem)

    return psbt.extractTransaction().toHex()
  }
}
