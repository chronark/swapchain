import { BitcoinAPI } from "../../types/bitcoinApi"
import axios from "axios"

export default class BlockStream {
  // implements BitcoinAPI {
  private baseURL: string

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
    const res = await axios.post("https://blockstream.info/api/tx", txHex, {
      headers: {
        "Content-Type": "text/plain",
      },
    })
    if (res.status === 200) {
      return res.data
    }
    throw new Error(res.data)
  }
}
