/**
 * Contains all necessary information to crate an HTLC on a blockchain
 *
 * @interface HTLCConfig
 */
export interface HTLCConfig {
  /**
   * The Wallet that is creating the transaction.
   *
   * @memberof HTLCConfig
   */
  sender: string

  /**
   * The receiving wallet.
   *
   * @memberof HTLCConfig
   */
  receiver: string

  /**
   * How much you want to send.
   *
   * @memberof HTLCConfig
   */
  amount: number

  /**
   * The type/currency you want to send.
   *
   * @memberof HTLCConfig
   */
  asset: string

  /**
   * TTL for the timelock in seconds. After this time passes the contract will be automatically redeemed by the sender.
   *
   * @memberof HTLCConfig
   */
  time: number

  /**
   * Private key for authorization of the sender.
   *
   * @memberof HTLCConfig
   */
  privateKey: string
}

export interface HTLCCreator {
  create(config: HTLCConfig): void
}
