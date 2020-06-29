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
    const hash = await axios.get(this.baseURL + "/blocks/tip/hash")
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
    const hash = await axios.get(this.baseURL + "/block-height/" + blockHeight)
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
   * Get value and transaction id from last transaction
   * 
   * @param address - The address to look for transactions.
   * @param out - A flag to look for transactions were the address is in the output (if set to true) or input (if set to false).
   * @returns Spendable value and the transaction id where the address occured in vin or vout.
   * @memberof BlockStream
   */
  public async getValueFromLastTransaction(address: string, out: boolean): Promise<{ value: number, txID: string }> {
    type Transaction = {
      txid: string,
      vin: {
        prevout: {
          scriptpubkey_address: string,
          value: number,
        }
      }[],
      vout: {
        scriptpubkey_address: string,
        value: number,
      }[],
    }

    const res = await axios.get(`${this.baseURL}/address/${address}/txs`)
    if (res.status !== 200) {
      throw new Error(res.data)
    }

    const transactions: Transaction[] = res.data
    for (let i = 0; i < transactions.length; i++) {
      const tx = transactions[i]
      if (out) {
        for (let j = 0; j < tx.vout.length; j++) {
          if (tx.vout[j].scriptpubkey_address === address) {
            return { value: tx.vout[j].value, txID: tx.txid }
          }
        }
      } else {
        for (let j = 0; j < tx.vin.length; j++) {
          if (tx.vin[j].prevout.scriptpubkey_address === address) {
            return { value: tx.vin[j].prevout.value, txID: tx.txid }
          }
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
}
