import * as bitcoin from "bitcoinjs-lib"
import fetch from "node-fetch"
import { csvGetFinalScripts } from "./csvGetFinal"

/**
 * This is a subset of a real transaction but we do not require the rest yet.
 *
 * @interface Transaction
 */
interface Transaction {
  hash: string
  hex: string
  outputs: {
    value: number
    addresses: string[]
  }[]
}

/**
 * Handler to create HTLCs on the bitcoin blockchain.
 *
 * @class BitcoinHTLC
 */
export default class BitcoinHTLC {
  private fee: number
  private network: bitcoin.Network
  /**
   * Creates an instance of BitcoinHTLC.
   *
   * @memberof BitcoinHTLC
   * @param fee - The fee to leave behind on every transaction. In Satoshis.
   * @param network - mainnet, testnet, or regtest.
   */
  constructor(fee = 1_000, network: bitcoin.Network = bitcoin.networks.testnet) {
    this.fee = fee
    this.network = network
  }

  /**
   * Create the redeem script in bitcoin's scripting language.
   *
   * @private
   * @param  sender - Alice's keypair.
   * @param  receiver - Bob's keypair.
   * @param  sequence - How many blocks need to be mined before Alice can refund the time lock.
   * @returns  A bitcoin script.
   * @memberof BitcoinHTLC
   */
  private redeemScript(sender: bitcoin.ECPairInterface, receiver: bitcoin.ECPairInterface, sequence: number): Buffer {
    return bitcoin.script.compile([
      bitcoin.opcodes.OP_IF,
      bitcoin.script.number.encode(sequence),
      bitcoin.opcodes.OP_CHECKSEQUENCEVERIFY,
      bitcoin.opcodes.OP_DROP,

      bitcoin.opcodes.OP_ELSE,
      receiver.publicKey,
      bitcoin.opcodes.OP_CHECKSIGVERIFY,
      bitcoin.opcodes.OP_ENDIF,

      sender.publicKey,
      bitcoin.opcodes.OP_CHECKSIG,
    ])
  }

  /**
   * Helperfunction to get the public key from an ECPair
   *
   * @private
   * @param  wallet - A wallet initialized as ECPair.
   * @returns A public address of the wallet.
   * @memberof BitcoinHTLC
   */
  private getPublicKey(wallet: bitcoin.ECPairInterface): string {
    return bitcoin.payments.p2pkh({ pubkey: wallet.publicKey, network: this.network }).address!
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
    return tx.outputs.filter((output: { value: number; addresses: string[] }) => {
      return output.addresses[0] === address
    })[0].value
  }

  /**
   * Calculate the p2sh to send our money to before creating the timelock refund operation.
   *
   * @private
   * @param  sender - Sender keypair.
   * @param  receiver - Receiver keypair.
   * @param  sequence - How many blocks to wait before refunding is allowed.
   * @returns The pay-to-scripthash object.
   * @memberof BitcoinHTLC
   */
  private getP2SH(
    sender: bitcoin.ECPairInterface,
    receiver: bitcoin.ECPairInterface,
    sequence: number,
  ): bitcoin.Payment {
    return bitcoin.payments.p2sh({
      redeem: {
        output: this.redeemScript(sender, receiver, sequence),
      },
      network: this.network,
    })
  }

  /**
   * Creates a partially signed bitcoin transaction.
   *
   * @private
   * @param hash - Transaction hash with unspent funds.
   * @param sender - The wallet where the funds are coming from.
   * @param sequence - How many blocks you want to wait before redeeming is possible.
   * @param outputs - Where the funds go.
   * @param [redeemScript] - Bitcoin script to manage redemption.
   * @returns The transaction hex to be pushed to the chain.
   * @memberof BitcoinHTLC
   */
  private async createPsbt(
    hash: string,
    sender: bitcoin.ECPairInterface,
    sequence: number,
    outputs: { address: string; value: number }[],
    redeemScript?: Buffer,
  ): Promise<string> {
    const senderPublicKey = this.getPublicKey(sender)

    const { vout, nonWitnessUtxo } = await this.getUtxo(hash, senderPublicKey)

    const psbt = new bitcoin.Psbt({ network: this.network })

    let inputParams = {
      hash,
      index: vout,
      sequence,
      nonWitnessUtxo,
    }
    if (typeof redeemScript !== "undefined") {
      inputParams = Object.assign(inputParams, { redeemScript })
    }

    psbt.addInput(inputParams)

    psbt.addOutputs(outputs)

    psbt.signInput(0, sender)
    psbt.validateSignaturesOfInput(0)
    psbt.finalizeAllInputs()
    return psbt.extractTransaction().toHex()
  }

  /**
   * Send funds to a pay2scripthash address to be used in the timelock refund operation.
   *
   * @private
   * @param sender - Origin wallet.
   * @param p2sh - Pay-to-script-hash object.
   * @param hashLockTransactionID - A Transaction id with unspent funds.
   * @param amountToSend - How many satoshis do you want to send.
   * @param sequence - How many blocks you want to wait before redemption.
   * @returns The hex-coded transaction. This needs to be pushed to the chain using `this.pushTX`
   * @memberof BitcoinHTLC
   */
  private async sendToP2SHAddress(
    sender: bitcoin.ECPairInterface,
    p2sh: bitcoin.Payment,
    hashLockTransactionID: string,
    amountToSend: number,
    sequence: number,
  ): Promise<string> {
    const senderPublicKey = this.getPublicKey(sender)

    const balance = await this.getBalance(senderPublicKey, hashLockTransactionID)
    const amountToKeep = balance - amountToSend - this.fee

    const outputs = [
      {
        address: senderPublicKey,
        value: amountToKeep,
      },
      {
        address: p2sh.address!,
        value: amountToSend,
      },
    ]

    return this.createPsbt(hashLockTransactionID, sender, sequence, outputs)
  }

  /**
   * Pushes a transaction hex to the blockchain.
   *
   * @private
   * @param hex - A transaction encoded as hex.
   * @returns The transactionID of the pushed transaction.
   * @memberof BitcoinHTLC
   */
  private async pushTX(hex: string): Promise<string> {
    const res = await fetch("https://testnet-api.smartbit.com.au/v1/blockchain/pushtx", {
      method: "POST",
      body: JSON.stringify({ hex }),
    }).then((res) => res.json())
    if (!res.success) {
      throw new Error(JSON.stringify(res.error))
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
    return fetch(`https://api.blockcypher.com/v1/btc/test3/txs/${transactionID}?limit=50&includeHex=true`).then((res) =>
      res.json(),
    )
  }

  /**
   * Return vout and nonWitnessUtxo.
   *
   * @private
   * @param transactionID - Transaction id you want to use.
   * @param targetAddress - Target address must be in the output of the transaction to get a valid `vout` id.
   * @returns vout and nonWitnessUtxo.
   * @memberof BitcoinHTLC
   */
  private async getUtxo(
    transactionID: string,
    targetAddress: string,
  ): Promise<{ vout: number; nonWitnessUtxo: Buffer }> {
    const tx = await this.getTransaction(transactionID)
    let vout = -1
    for (let i = 0; i < tx.outputs.length; i++) {
      if (tx.outputs[i].addresses.includes(targetAddress)) {
        vout = i
        break
      }
    }
    if (vout < 0) {
      throw new Error("Could not find vout")
    }
    const nonWitnessUtxo = Buffer.from(tx.hex, "hex")

    return {
      vout,
      nonWitnessUtxo,
    }
  }

  /**
   *
   *
   * @param  sender - Alice.
   * @param receiver - Bob.
   * @param  hashLockTransactionID - The transaction id from the preceeding hashlock-transaction.
   * @param  amount - How much you want to send in Satoshis.
   * @param  sequence - How long you have to wait before refunding. In blocks.
   * @returns Hex-coded transaction to be published to the chain.
   * @memberof BitcoinHTLC
   */
  public async getTimeLockHex(
    sender: bitcoin.ECPairInterface,
    receiver: bitcoin.ECPairInterface,
    hashLockTransactionID: string,
    amount: number,
    sequence: number,
  ): Promise<string> {
    const p2sh = this.getP2SH(sender, receiver, sequence)

    // move funds to p2sh address
    const p2shHex = await this.sendToP2SHAddress(sender, p2sh, hashLockTransactionID, amount, 0)
    const txID = await this.pushTX(p2shHex)

    // Wait for the transaction to be broadcasted
    await new Promise((resolve) => setTimeout(resolve, 5000))

    // refund transaction
    const { vout, nonWitnessUtxo } = await this.getUtxo(txID, p2sh.address!)

    const psbt = new bitcoin.Psbt({ network: this.network })
      .addInput({
        hash: txID,
        index: vout,
        sequence,
        redeemScript: p2sh.redeem!.output!,
        nonWitnessUtxo,
      })
      .addOutput({
        address: this.getPublicKey(receiver),
        value: amount, // in satoshi
      })
      .signInput(0, sender)
      .finalizeInput(0, csvGetFinalScripts)
      .extractTransaction()

    return psbt.toHex()
  }
}
