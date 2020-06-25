import { BitcoinAPI } from "../../types/bitcoinApi"
import axios from "axios"
import { number } from "bitcoinjs-lib/types/script"

export default class BlockStream {
  // implements BitcoinAPI {
  public baseURL: string

  constructor(network: string) {
    this.baseURL = `https://blockstream.info/${network === "testnet" ? "testnet/" : ""}api`
  }

  public async getLastBlock(): Promise<{ height: number; timestamp: number }> {
    const hash = await axios.get(this.baseURL + "/blocks/tip/hash")
    const block = await axios.get(this.baseURL + "/block/" + hash).then((res) => res.data)

    return { height: block.height, timestamp: block.timestamp }
  }

  public async getTimestampAtHeight(blockHeight: number): Promise<number> {
    const hash = await axios.get(this.baseURL + "/block-height/" + blockHeight)
    const block = await axios.get(this.baseURL + "/block/" + hash).then((res) => res.data)

    return block.timestamp
  }

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
}
