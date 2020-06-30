import { BitcoinAPI } from "../../types/bitcoinApi"
import axios from "axios"

/**
 * Handler to fetch and push data from the Blockstream API.
 *
 * @class BlockStream
 * @implements {BitcoinAPI}
 */
export default class BlockStream implements BitcoinAPI {
  public baseURL: string

  /**
   * Creates an instance of BlockStream.
   *
   * @param network - The network type, either "testnet" or "mainnet".
   * @memberof BlockStream
   */
  constructor(network: string) {
    this.baseURL = `https://blockstream.info/${network === "testnet" ? "testnet/" : ""}api`
  }

  /**
   * Get information of last block broadcasted
   *
   * @returns Height and timestamp of the last block.
   * @memberof BlockStream
   */
  public async getLastBlock(): Promise<{ height: number; timestamp: number }> {
    const res = await axios.get(this.baseURL + "/blocks/tip/hash")

    if (res.status !== 200) {
      throw new Error("Could not fetch last block")
    }

    const hash = res.data
    const block = await axios.get(this.baseURL + "/block/" + hash).then((res) => res.data)

    return { height: block.height, timestamp: block.timestamp }
  }

  /**
   * Get timestamp of block for given height
   *
   * @param blockHeight - The desired block height.
   * @returns Timestamp of a block defined by its height.
   * @memberof BlockStream
   */
  public async getTimestampAtHeight(blockHeight: number): Promise<number> {
    const res = await axios.get(this.baseURL + "/block-height/" + blockHeight)

    if (res.status !== 200) {
      throw new Error("Could not fetch block")
    }

    const hash = res.data
    const block = await axios.get(this.baseURL + "/block/" + hash).then((res) => res.data)

    return block.timestamp
  }

  /**
   * Push transaction to the bitcoin network
   *
   * @param txHex - An encoded transaction in hex format.
   * @returns Transaction id on success or throws error on failure.
   * @memberof BlockStream
   */
  public async pushTX(txHex: string): Promise<string> {
    const res = await axios.post(this.baseURL + "/tx", txHex, {
      headers: {
        "Content-Type": "text/plain",
      },
    })
    if (res.status === 200) {
      return res.data
    }

    throw new Error(res.data)
  }

  /**
   * Return the Preimage of the last transacction.
   *
   * @param address - The address to look for transactions.
   * @returns Preimage where address was found in vin.
   * @memberof BlockStream
   */
  public async getPreimageFromLastTransaction(address: string): Promise<string> {
    type Transaction = {
      vin: {
        prevout: {
          scriptpubkey_address: string
        }
        witness: string[]
      }[]
    }

    const res = await axios.get(`${this.baseURL}/address/${address}/txs`)
    if (res.status !== 200) {
      throw new Error(res.data)
    }
    const transactions: Transaction[] = res.data
    for (let i = 0; i < transactions.length; i++) {
      const tx = transactions[i]
      for (let j = 0; j < tx.vin.length; j++) {
        if (tx.vin[j].prevout.scriptpubkey_address === address) {
          // The witness is stored (serialized as string) on the blockchain
          // We need to deserialize it by loading it into a Buffer and transform it back to a regular string
          return Buffer.from(tx.vin[j].witness[1], "hex").toString()
        }
      }
    }
    // This can actually never occur but otherwise typescript will cry.
    throw new Error("Could not find matching address.")
  }

  /**
   * Get value and transaction id from last transaction
   *
   * @param address - The address to look for transactions.
   * @returns Spendable value and the transaction id where the address occured in vout.
   * @memberof BlockStream
   */
  public async getValueFromLastTransaction(address: string): Promise<{ value: number; txID: string }> {
    type Transaction = {
      txid: string
      vout: {
        scriptpubkey_address: string
        value: number
      }[]
    }

    const res = await axios.get(`${this.baseURL}/address/${address}/txs`)
    if (res.status !== 200) {
      throw new Error(res.data)
    }

    const transactions: Transaction[] = res.data
    for (let i = 0; i < transactions.length; i++) {
      const tx = transactions[i]

      for (let j = 0; j < tx.vout.length; j++) {
        if (tx.vout[j].scriptpubkey_address === address) {
          return { value: tx.vout[j].value, txID: tx.txid }
        }
      }
    }

    // This can actually never occur but otherwise typescript will cry.
    throw new Error("Could not find matching address.")
  }

  /**
   * Return the vout and value of the transaction.
   *
   * @param transactionID - ID of any bitcoin transaction.
   * @param address - The address to look for.
   * @returns vout and value
   * @memberof BlockStream
   */
  public async getOutput(transactionID: string, address: string): Promise<{ vout: number; value: number }> {
    const res = await axios.get(`${this.baseURL}/tx/${transactionID}`)
    if (res.status !== 200) {
      throw new Error(res.data)
    }

    const tx = res.data
    let vout = -1
    for (let i = 0; i < tx.vout.length; i++) {
      if (tx.vout[i].scriptpubkey_address === address) {
        vout = i
        break
      }
    }

    if (vout < 0) {
      throw new Error("Could not find vout")
    }

    return {
      vout,
      value: tx.vout[vout].value,
    }
  }

  /**
   * Return the block height of the transaction.
   *
   * @param transactionID - ID of any bitcoin transaction.
   * @returns Blockheight or undefined if block is not mined/broadcasted yet.
   * @memberof BlockStream
   */
  public async getBlockHeight(transactionID: string): Promise<number | undefined> {
    const res = await axios.get(`${this.baseURL}/tx/${transactionID}`)
    if (res.status !== 200) {
      throw new Error(res.data)
    }

    return res.data.status.block_height
  }
}
