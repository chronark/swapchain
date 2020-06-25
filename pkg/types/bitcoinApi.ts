import { Payment } from "bitcoinjs-lib/types/payments"

/**
 * This interface defines the data required for the HTLC creation on the bitcoin blockchain.
 * You are welcome to implement this yourself and pass it to the HTLC class.
 *
 * The return objects are explicitly stated here as these are the only values we require.
 * Anything else returned from your api of choice can be ignored.
 *
 * @interface BitcoinAPI
 */
export interface BitcoinAPI {
  /**
   * Return height and timestamp of the last block.
   * Used for timelock calculations.
   */
  getLastBlock: () => Promise<{ height: number; timestamp: number }>

  /**
   * Return the timestamp of a block defined by its height.
   * Used for timelock calculations
   */
  getTimestampAtHeight: (n: number) => Promise<number>

  // TODO: Do we need this?
  /**
   * Return the transaction details.
   * Used to get
   * //TODO: Talk this through with Nico.
   */
  getTransaction: (transactionID: string) => Promise<{}>

  /**
   * Pushes a transaction hex to the blockchain.
   * Returns the transactionID on success.
   * Throws on failure
   */
  pushTX: (transactionHex: string) => Promise<string>

  // TODO: check for logic [ in <-> out ]
  /**
   * Returns either the last incoming transaction or outgoing transaction of an address.
   *
   * @param address - Any bitcoin address.
   * @param out - Search for an incoming or outgoing transaction.
   * @returns Amount of the transaction and its ID.
   */
  getAmountFromLastTransaction: (address: string, out: boolean) => Promise<{ amount: number; txID: string }>

  /**
   * Return the vout and value of the transaction.
   *
   * @param transactionID - ID of any bitcoin transaction.
   * @returns vout and value
   */
  getOutput: (transactionID: string) => Promise<{ vout: number; value: number }>
}
