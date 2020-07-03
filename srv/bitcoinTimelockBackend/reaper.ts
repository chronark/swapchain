import HexTransaction from "./HexTransaction.model"
import { BitcoinAPI, BitcoinAPIConstructor } from "../web/src/pkg/types/bitcoinApi"
export default class Reaper {
  private network: string
  private bitcoinAPI: BitcoinAPI

  constructor(network: string, BitcoinAPIConstructor: BitcoinAPIConstructor) {
    this.network = network
    this.bitcoinAPI = new BitcoinAPIConstructor(network)
  }

  public async redeemAllValid(): Promise<void> {
    console.log("Running reaper...")
    const currentBlock = await this.bitcoinAPI.getLastBlock()

    while (true) {
      const hexTransaction = await HexTransaction.findOneAndRemove({
        validAfterBlockHeight: {
          $lte: currentBlock.height,
        },
      })

      if (!hexTransaction) {
        break
      }

      const txID = await this.bitcoinAPI.pushTX(hexTransaction.hex).catch((err: Error) => {
        console.error(err)
      })
      if (txID) {
        await hexTransaction.remove()
      }
    }
    console.log("...done")
  }
}
