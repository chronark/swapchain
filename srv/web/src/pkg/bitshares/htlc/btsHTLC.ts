import { Apis as btsWebsocketApi } from "bitsharesjs-ws"
import { ChainStore, FetchChain, TransactionBuilder, PrivateKey } from "bitsharesjs"
import { Secret } from "../../../pkg/secret/secret"

/**
 * Contains all necessary information to create an HTLC on Bitshares blockchain
 *
 * @interface HTLCConfig
 */
interface HTLCConfig {
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
   * SHA256 hash of the secret.
   *
   * @memberof HTLCConfig
   */
  hash: Buffer

  /**
   * Private key of the creator in WIF format.
   *
   * @memberof HTLCConfig
   */

  privateKey: string
}

/**
 * Handler to create HTLCs on the bitshares blockchain using a specified node.
 *
 * @class BitsharesHTLC
 */
export default class BitsharesHTLC {
  private node: string
  private sender: string
  private receiver: string
  private websocket: Promise<void> | null
  private keepLooking: boolean
  /**
   * Creates an instance of BitsharesHTLC.
   *
   * @param node - The Bitshares node you want to connect to.
   * @param sender - The account that is creating the transaction.
   * @param receiver - The receiving account.
   * @memberof BitsharesHTLC
   */
  constructor(node: string, sender: string, receiver: string) {
    this.node = node
    this.sender = sender
    this.receiver = receiver
    this.websocket = null
    this.keepLooking = true
  }

  /**
   * Opens a websocket to a bitshares node
   *
   * This has to be done before you can interact with the blockchain.
   *
   * @private
   * @param node - The address of a node
   * @memberof BitsharesHTLC
   */
  private async openSocket(node: string): Promise<void> {
    this.websocket = await btsWebsocketApi.instance(node, true).init_promise
  }

  /**
   * Stops looking for matching HTLC.
   */
  public stopLooking(): void {
    this.keepLooking = false
  }

  /**
   * Wrapper function to open the websocket if necessary.
   *
   * @param config - HTLC information.
   * @returns Success or failure.
   * @memberof BitsharesHTLC
   */
  public async create(config: HTLCConfig): Promise<boolean> {
    if (this.websocket === null) {
      await this.openSocket(this.node)
    }

    return this.createHTLC(config)
  }

  /**
   * Wrapper function to open the websocket if necessary.
   *
   * @param amount - The asset amount of the HTLC.
   * @param privateKey - Private key of the redeemer in WIF format.
   * @param secret - A secret object.
   * @returns Success or failure.
   * @memberof BitsharesHTLC
   */
  public async redeem(amount: number, privateKey: string, secret: Secret): Promise<boolean> {
    if (this.websocket === null) {
      await this.openSocket(this.node)
    }

    return this.redeemHTLC(amount, privateKey, secret)
  }

  /**
   * Create and send the actual HTLC.
   *
   * Never call this function directly but use `create()` instead.
   * That's because the websocket must be open before creating an HTLC.
   *
   * @private
   * @param config - Configuration object for the HTLC.
   * @returns Success status. Can be used for user feedback.
   * @memberof BitsharesHTLC
   */
  private async createHTLC(config: HTLCConfig): Promise<boolean> {
    // TODO: Requires proper error handling. Right now it always returns true.
    const { amount, asset, time, hash, privateKey } = config
    await ChainStore.init(false)

    const [senderAccount, toAccount, sendAsset] = await Promise.all([
      FetchChain("getAccount", this.sender),
      FetchChain("getAccount", this.receiver),
      FetchChain("getAsset", asset),
    ])

    const tr = new TransactionBuilder()
    /* eslint-disable @typescript-eslint/camelcase */
    tr.add_type_operation("htlc_create", {
      from: senderAccount.get("id"),
      to: toAccount.get("id"),
      amount: { amount: amount, asset_id: sendAsset.get("id") },
      preimage_hash: [2, hash.toString("hex")],
      preimage_size: 32, // All our secrets are of length 32
      claim_period_seconds: time,
    })
    /* eslint-enable @typescript-eslint/camelcase */

    await tr.set_required_fees()
    tr.add_signer(PrivateKey.fromWif(privateKey))
    tr.broadcast()

    return true
  }

  /**
   * Redeem the actual HTLC.
   *
   * Never call this function directly but use `redeem()` instead.
   * That's because the websocket must be open before redeeming an HTLC.
   *
   * @private
   * @param amount - The amount of assets of the HTLC.
   * @param privateKey - Private key of the redeemer in WIF format.
   * @param secret - A secret object with the correct preimage.
   * @returns Success status. Can be used for user feedback.
   * @memberof BitsharesHTLC
   */
  private async redeemHTLC(amount: number, privateKey: string, secret: Secret): Promise<boolean> {
    await ChainStore.init(false)

    const [toAccount] = await Promise.all([FetchChain("getAccount", this.receiver)])

    const htlcId = await this.getID(amount, secret.hash)

    // If there was no HTLC found, return false for errorhandling
    if (!htlcId) {
      return false
    }

    const tr = new TransactionBuilder()
    /* eslint-disable @typescript-eslint/camelcase */
    tr.add_type_operation("htlc_redeem", {
      preimage: Buffer.from(secret.preimage!).toString("hex"),
      htlc_id: htlcId,
      redeemer: toAccount.get("id"),
      extensions: null,
    })
    /* eslint-enable @typescript-eslint/camelcase */

    await tr.set_required_fees()
    tr.add_signer(PrivateKey.fromWif(privateKey))
    await tr.broadcast()
    return true
  }

  /**
   * Get the HTLC BitShares ID.
   *
   * Only for internal purposes.
   * The HTLC ID is necessary to redeem an HTLC.
   * Websocket must be open.
   *
   * @public
   * @param amount - The amount of assets of the HTLC.
   * @param hash - The SHA256 hash of the secret.
   * @returns HTLC ID of an instance or empty string if no matching HTLC was found.
   * @memberof BitsharesHTLC
   */
  public async getID(amount: number, hash: Buffer): Promise<string> {
    if (this.websocket === null) {
      await this.openSocket(this.node)
    }
    const limit = 100

    const [senderAccount, toAccount] = await btsWebsocketApi.db.get_accounts([this.sender, this.receiver])
    while (this.keepLooking) {
      const history = await btsWebsocketApi.history.get_relative_account_history(this.receiver, 0, limit, 0)

      /* eslint-disable @typescript-eslint/no-explicit-any */
      const htlc = history.filter((element: any) => {
        return (
          typeof element.result[1] === "string" &&
          element.result[1].startsWith("1.16.") &&
          element.op[1].from === senderAccount.id &&
          element.op[1].to === toAccount.id &&
          element.op[1].preimage_hash[1] === hash.toString("hex") &&
          element.op[1].amount.amount === amount
        )
      })
      /* eslint-enable @typescript-eslint/camelcase */

      if (htlc.length === 1) {
        return htlc[0].result[1]
      }

      // Wait three secondes, then try again
      await new Promise((resolve) => setTimeout(resolve, 3000))
    }

    // If no matching HTLC was found
    return ""
  }
}
