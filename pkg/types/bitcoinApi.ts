/*
 Push transaction
 get current blockheight
 get block at height
    - so we can calculate timedifference between blocks
 get transaction by id
    - for vout
    - for balance

*/

/**
 * This interface defines the data required for the HTLC creation on the bitcoin blockchain.
 * You are welcome to implement this yourself and pass it to the HTLC class .
 *
 * For development we are using https://blockstream.info/api to query data and push transactions.
 *
 * The return objects are explicitly stated here as these are the only values we require.
 * Anything else returned from your api of choice can be ignored.
 *
 * @export
 * @interface BitcoinAPI
 */
export interface BitcoinAPI {
  /**
   * Return useful information about the last block.
   * Used for timelock calculations.
   */
  getLastBlock: () => Promise<{ height: number; timestamp: number }>

  /**
   * Return the timestamp of a block defined by its height.
   * Used for timelock calculations
   */
  getTimestampAtHeight: (n: number) => Promise<number>

  /**
   * Return the transaction details.
   * Used to get
   * //TODO: Talk this through with Nico.
   */
  getTransaction: (transactionID: string) => Promise<{}>

  /**
   * Pushes a transaction hex to the blockchain.
   * Returns
   *  - the transactionID on success.
   *  - empty string on error and sets the err to be handled by the caller.
   */
  pushTX: (transactionHex: string) => Promise<{ txID: string; err: Error }>
}
