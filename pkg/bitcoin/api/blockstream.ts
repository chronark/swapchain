import fetch from "node-fetch"
import { BitcoinAPI } from "../../types/bitcoinApi"
import axios from "axios"

export default class BlockStream {
  // implements BitcoinAPI {
  private baseURL: string

  constructor() {
    this.baseURL = "https://blockstream.info/api"
  }

  public async getLastBlock(): Promise<{ height: number; timestamp: number }> {
    const hash = await axios.get(this.baseURL + "/blocks/tip/hash")
    const block = await axios.get(this.baseURL + "/block/" + hash).then((res) => res.data)

    return { height: block.height, timestamp: block.timestamp }
  }
}
