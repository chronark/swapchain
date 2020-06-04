import fetch from "node-fetch"
import HexTransaction, { HexTransactionType } from "./HexTransaction.model"
export class Reaper {
  private interval: number
  private network: string

  constructor(interval = 10, network: string) {
    this.interval = interval
    this.network = network
  }

  public run(): void {
    setInterval(() => this.redeemAllValid, this.interval)
  }

  public async redeemAllValid(): Promise<void> {
    const currentBlockHeight = await this.getCurrentBlockHeight()

    while (true) {
      const hexTransaction = await HexTransaction.findOneAndRemove({
        validAfterBlockHeight: {
          $lte: currentBlockHeight,
        },
      })

      if (!hexTransaction) {
        break
      }

      const txID = await this.publishTX(hexTransaction.hex)
      if (txID) {
        await hexTransaction.remove()
      }
    }
  }

  /**
   * Fetch blockcypher's api for the current block.
   *
   * @private
   * @returns The current block height.
   * @memberof Reaper
   */
  private async getCurrentBlockHeight(): Promise<number | undefined> {
    let url = "https://api.blockcypher.com/v1/btc/"
    url += this.network === "testnet" ? "test3" : "main"

    const res = await fetch(url).then((res) => res.json())
    if (res.height) {
      return res.height
    }
    return undefined
  }

  /**
   * Publishes a transaction hex to the blockchain.
   *
   * @private
   * @param hex - A transaction encoded as hex.
   * @returns The transactionID of the pushed transaction.
   * @memberof BitcoinHTLC
   */
  private async publishTX(hex: string): Promise<string | void> {
    const res = await fetch("https://testnet-api.smartbit.com.au/v1/blockchain/pushtx", {
      method: "POST",
      body: JSON.stringify({ hex }),
    }).then((res) => res.json())
    if (res.txid) {
      return res.txid
    }
  }
}
