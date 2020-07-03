import * as bitcoin from "bitcoinjs-lib"
import { PsbtInput } from "bip174/src/lib/interfaces"
import { witnessStackToScriptWitness } from "./witnessStack"
import { Secret } from "../../../pkg/secret/secret"
import { BitcoinAPI, BitcoinAPIConstructor } from "../../types/bitcoinApi"

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
 *
 */
export default class BitcoinHTLC {
  private network: bitcoin.Network
  private sender: bitcoin.ECPairInterface
  private receiver: bitcoin.ECPairInterface
  private priority: number
  private fundingTxBlockHeight: number | undefined
  private preimage: string
  private amountAfterFees: number
  public bitcoinAPI: BitcoinAPI
  /**
   * Creates an instance of BitcoinHTLC.
   *
   * @memberof BitcoinHTLC
   * @param network - mainnet, testnet, or regtest.
   * @param sender - Sender keypair.
   * @param receiver - Receiver keypair.
   * @param priority - The transaction priority (0 = high, 1 = medium, 2 = low)
   * @param BitcoinAPIConstructor - Bitcoin API to use for communication with the blockchain.
   */
  constructor(
    network = "testnet",
    sender: bitcoin.ECPairInterface,
    receiver: bitcoin.ECPairInterface,
    priority: number,
    BitcoinAPIConstructor: BitcoinAPIConstructor,
  ) {
    this.network = network === "testnet" ? bitcoin.networks.testnet : bitcoin.networks.bitcoin
    this.sender = sender
    this.receiver = receiver
    this.priority = priority
    this.fundingTxBlockHeight = undefined
    this.preimage = ""
    this.amountAfterFees = 0
    this.bitcoinAPI = new BitcoinAPIConstructor(network)
  }

  /**
   * Get block height of funding transaction
   *
   * @returns Blockheight of funding transaction or undefined if block is not mined/broadcasted yet.
   * @memberof BitcoinHTLC
   */
  public getFundingTxBlockHeight(): number | undefined {
    return this.fundingTxBlockHeight
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
    const decompiled = bitcoin.script.decompile(script)
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
    const decompiled = bitcoin.script.decompile(script)
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
    // Value is the current balance after the transaction
    const { vout, value } = await this.bitcoinAPI.getOutput(transactionID, p2wpkFromSender.address!)
    const amountToKeep = value - amount
    // If output of the transaction ID given does not have sufficient value/balance
    if (amountToKeep < 0) {
      throw new Error(`The output of the transaction ID ${transactionID} does not have sufficient balance`)
    }

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
    const psbt = new bitcoin.Psbt({ network: this.network })
      .setVersion(2)
      .addInput({
        hash: transactionID,
        index: vout,
        witnessUtxo: {
          script: p2wpkFromSender.output!,
          value,
        },
      })
      .addOutputs(outputs)
      .signInput(0, this.sender)

    psbt.validateSignaturesOfInput(0)
    psbt.finalizeAllInputs()
    return psbt.extractTransaction().toHex()
  }

  /**
   * Get fee estimates and calculate fee depending on priority
   *
   * @returns Fee for a single transaction in Satoshi.
   * @memberof BitcoinHTLC
   */
  private async calculateFee(): Promise<number> {
    const feeEstimates = await this.bitcoinAPI.getFeeEstimates()

    const averageTransactionSize = 150 // On average our transaction size is about 150 vBytes

    return feeEstimates[Math.min(feeEstimates.length - 1, this.priority)] * averageTransactionSize
  }

  /**
   * Redeems an HTLC.
   *
   * @param p2wsh - The Pay-to-witness-script-hash object to redeem.
   * @param secret - The secret object with the correct preimage inside.
   * @memberof BitcoinHTLC
   */
  public async redeem(p2wsh: bitcoin.Payment, secret: Secret): Promise<void> {
    // Save preimage as attribute to inject it into the getFinalScriptsRedeem method
    this.preimage = secret.preimage!

    const { value, txID } = await this.bitcoinAPI.getValueFromLastTransaction(p2wsh.address!) // TODO: Check if amount is enough!

    const fee = await this.calculateFee()

    this.amountAfterFees = value - fee
    const redeemHex = await this.getRedeemHex(txID, p2wsh)

    const redeemTransaction = await this.bitcoinAPI.pushTX(redeemHex)

    if (!redeemTransaction) {
      throw new Error(`Error pushing redeemHex to endpoint. Hex for redeem transaction: ${redeemHex}`)
    }
  }

  /**
   * Creates an HTLC.
   *
   * @param config - Configuration object for the HTLC.
   * @returns The hex for the refund transaction.
   * @memberof BitcoinHTLC
   */
  public async create(config: HTLCConfigBTC): Promise<string> {
    const { transactionID, amount, sequence, hash } = config

    const fee = await this.calculateFee()

    // Substract first fee for funding transaction
    this.amountAfterFees = amount - fee

    if (this.amountAfterFees <= 0) {
      throw new Error(
        `You are trying to send less money than the fees to transfer it, please use a value higher than ${fee}`,
      )
    }

    const p2wsh = this.getP2WSH(hash, sequence)
    // Funding
    const p2wpkHex = await this.sendToP2WSHAddress(p2wsh, transactionID, amount)

    const fundingTransactionID = await this.bitcoinAPI.pushTX(p2wpkHex)

    if (!fundingTransactionID) {
      throw new Error("Pushing funding transaction failed. Is the endpoint down?")
    }

    // Wait for the funding transaction to be broadcasted
    await new Promise((resolve) => setTimeout(resolve, 5000))

    // Substract second fee for potential refund transaction
    this.amountAfterFees = this.amountAfterFees - fee

    // Refunding
    const refundHex = await this.getRefundHex(fundingTransactionID, sequence, p2wsh)

    this.fundingTxBlockHeight = await this.bitcoinAPI.getBlockHeight(fundingTransactionID)
    while (!this.fundingTxBlockHeight) {
      this.fundingTxBlockHeight = await this.bitcoinAPI.getBlockHeight(fundingTransactionID)
      await new Promise((resolve) => setTimeout(resolve, 10_000))
    }

    return refundHex
    /*
    const payload = { hex: refundHex, validAfterBlockHeight: this.fundingTxBlockHeight + sequence }
    const res = await fetch("http://localhost:13000", { method: "POST", body: JSON.stringify(payload) }).then((res) =>
      res.json(),
    )

    if (!res.success) {
      throw new Error(`Posting refundHex to database. Hex for refund transaction: ${refundHex}`)
    }
    */
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
    const { vout, value } = await this.bitcoinAPI.getOutput(transactionID, p2wsh.address!)

    const psbt = new bitcoin.Psbt({ network: this.network })
      .setVersion(2)
      .addInput({
        hash: transactionID,
        index: vout,
        sequence: sequence,
        witnessUtxo: {
          script: p2wsh.output!,
          value: value,
        },
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
    const { vout, value } = await this.bitcoinAPI.getOutput(transactionID, p2wsh.address!)
    const psbt = new bitcoin.Psbt({ network: this.network })
      .setVersion(2)
      .addInput({
        hash: transactionID,
        index: vout,
        witnessUtxo: {
          script: p2wsh.output!,
          value,
        },
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
