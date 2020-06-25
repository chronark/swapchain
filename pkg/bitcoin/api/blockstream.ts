import fetch from "node-fetch"
import { BitcoinAPI } from "../../types/bitcoinApi"

export default class BlockStream {
  // implements BitcoinAPI {
  private baseURL: string

  constructor() {
    this.baseURL = "https://blockstream.info/api"
  }

  public async getLastBlock(): Promise<{ height: number; timestamp: number }> {
    const hash = await fetch(this.baseURL + "/blocks/tip/hash").then((res) => res.body)
    const block = await fetch(this.baseURL + "/block/" + hash).then((res) => res.json())

    return { height: block.height, timestamp: block.timestamp }
  }
}
