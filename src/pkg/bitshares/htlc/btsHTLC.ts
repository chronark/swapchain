import { Apis as btsWebsocketApi } from "bitsharesjs-ws"
import { ChainStore, FetchChain, TransactionBuilder, PrivateKey } from "bitsharesjs"
import { Secret } from "../../../pkg/secret/secret"
import { BitsharesAPI } from "../api/api"

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
  private senderID: string
  private receiverID: string
  /**
   * Creates an instance of BitsharesHTLC.
   *
   * @param node - The Bitshares node you want to connect to.
   * @param senderID - The account that is creating the transaction.
   * @param receiverID - The receiving account.
   * @memberof BitsharesHTLC
   */
  constructor(node: string, senderID: string, receiverID: string) {
    this.node = node
    this.senderID = senderID
    this.receiverID = receiverID
  }

  /**
   * Create and send the actual HTLC.
   *
   * @private
   * @param config - Configuration object for the HTLC.
   * @returns Success status. Can be used for user feedback.
   * @memberof BitsharesHTLC
   */
  public async create(config: HTLCConfig): Promise<boolean> {
    await BitsharesAPI.getInstance(this.node)
    const { amount, asset, time, hash, privateKey } = config

    const sendAsset = await FetchChain("getAsset", asset)

    const tr = new TransactionBuilder()
    /* eslint-disable @typescript-eslint/camelcase */
    tr.add_type_operation("htlc_create", {
      from: this.senderID,
      to: this.receiverID,
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
  public async redeem(amount: number, privateKey: string, secret: Secret): Promise<boolean> {
    const websocket = await BitsharesAPI.getInstance(this.node)

    // Throws if nothing is found, you must handle this in accs.
    const htlcID = await websocket.getID(this.senderID, this.receiverID, amount, secret.hash)
    const tr = new TransactionBuilder()
    tr.add_type_operation("htlc_redeem", {
      preimage: Buffer.from(secret.preimage!).toString("hex"),
      /* eslint-disable-next-line @typescript-eslint/camelcase */
      htlc_id: htlcID,
      redeemer: this.receiverID,
      extensions: null,
    })

    await tr.set_required_fees()
    tr.add_signer(PrivateKey.fromWif(privateKey))
    await tr.broadcast()

    return true
  }
}
