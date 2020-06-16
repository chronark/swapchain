import fetch from "node-fetch"
import HexTransaction, { HexTransactionType } from "./HexTransaction.model"
export default class Reaper {
  private network: string

  constructor(network: string) {
    this.network = network

    if (!process.env.BLOCKCYPHER_API_TOKEN || process.env.BLOCKCYPHER_API_TOKEN.length === 0) {
      throw new ReferenceError("Could not load BLOCKCYPHER_API_TOKEN from environment")
    }
  }

  public async redeemAllValid(): Promise<void> {
    console.log("Running reaper...")
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
    console.log("...done")
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
    url += "?token=" + process.env.BLOCKCYPHER_API_TOKEN

    const res = await fetch(url).then((res) => res.json())
    if (res.height) {
      return res.height
    }
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
      console.log("Successfully refund: " + hex)
      return res.txid
    }
    console.error("Could not refund: " + hex)
  }
}
