import { BitcoinAPIConstructor, BitcoinAPI } from "../pkg/types/bitcoinApi"

/**
 * Handler to transform timelocks between blockchains.
 */
export class Timer {
  private bitcoinAPI: BitcoinAPI
  private blockSequence: number

  /**
   * Creates an instance of Timer.
   *
   * @param blockSequence
   * @param network
   * @param BitcoinAPIConstructor
   */
  constructor(blockSequence: number, network: string, BitcoinAPIConstructor: BitcoinAPIConstructor) {
    this.bitcoinAPI = new BitcoinAPIConstructor(network)
    const minBlockSequence = 6
    const maxBlockSequence = 20
    this.blockSequence = blockSequence

    if (this.blockSequence < minBlockSequence || this.blockSequence > maxBlockSequence) {
      throw new Error(`Specified block sequence must be within ${minBlockSequence} and ${maxBlockSequence}`)
    }
  }

  /**
   * Get Bitcoin timelock.
   *
   * @returns Bitcoin timelock in number of blocks.
   */
  public toBTC(): number {
    return this.blockSequence
  }

  /**
   * Calculate Bitshares timelock based on bitcoin blockchain mining speed.
   *
   * @param blockHeightDifference - The number of blocks to calculate mean.
   * @returns Bitshares timelock in seconds.
   */
  public async toBTS(blockHeightDifference: number = 10): Promise<number> {
    const lastBlock = await this.bitcoinAPI.getLastBlock()
    const pastTimestamp = await this.bitcoinAPI.getTimestampAtHeight(lastBlock.height - blockHeightDifference)

    const speedBTC = (lastBlock.timestamp - pastTimestamp) / blockHeightDifference
    return Math.round(this.blockSequence * speedBTC)
  }
}
