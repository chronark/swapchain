import fetch from "node-fetch"

/**
 * Set up a Timers class prompting the user for a desired HTLC timer specified in blocks. One block equals roughly 10 minutes.
 * Default timer is set at 6 blocks (approx. 1 hour).
 * Minimum timer equals 4 blocks (approx. 0.75 hours).
 * Maximum timer equals 4000 blocks (approx. 667 hours).
 */

class Timers {
  private blockSequence: number
  constructor() {
    const minBlockSequence = 4
    const maxBlockSequence = 4000
    const defaultBlockSequence = 6
    this.blockSequence = Number(process.argv[2]) || defaultBlockSequence
    if (this.blockSequence < minBlockSequence || this.blockSequence > maxBlockSequence) {
      console.error("Specified blockSequence is either too high (>4000) or too low (<4).")
      process.exit(1)
    }
  }

  /**
   * toBTC: timer is specified in blocks. Average time (mean) of the last 10 blocks is fetched and calculated.
   * toBTS: timer is specified in seconds. Average time (mean) is utilised here to deliver a value in seconds.
   */

  public toBTC(): number {
    return this.blockSequence
  }

  public async toBTS(): Promise<number> {
    const blockHeight = await fetch("https://blockstream.info/api/blocks").then((res) => res.json())
    const speedBTC = (blockHeight[0].timestamp - blockHeight[9].timestamp) / 10
    return this.blockSequence * speedBTC
  }
}

console.log("toBTC: ", new Timers().toBTC())
new Timers().toBTS().then((s: number) => console.log("toBTS: ", s))
