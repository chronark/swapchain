import { Apis as btsWebsocketApi } from "bitsharesjs-ws"
import { ChainStore, FetchChain, TransactionBuilder, PrivateKey } from "bitsharesjs"
import { Secret } from "../../../tmp/secret"
import { HTLCConfig, HTLCCreator } from "../../../pkg/types/htlc"

/**
 * Handler to create HTLCs on the bitshares blockchain using a specified node.
 *
 * @class BitsharesHTLC
 * @implements {HTLCCreator}
 */
export default class BitsharesHTLC implements HTLCCreator {
  private node: string
  private websocket: Promise<void> | null
  /**
   * Creates an instance of BitsharesHTLC.
   *
   * @param node - The Bitshares node you want to connect to.
   * @memberof BitsharesHTLC
   */
  constructor(node: string) {
    this.node = node
    this.websocket = null
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
   * Wrapper function to open the websocket if necessary.
   *
   * @param config - HTLC information.
   * @param privateKey - Private key of the creator in WIF format.
   * @param preimage - Secret object.
   * @returns Success or failure.
   * @memberof BitsharesHTLC
   */
  public async create(config: HTLCConfig, privateKey: string, preimage: Secret): Promise<boolean> {
    if (this.websocket === null) {
      await this.openSocket(this.node)
    }

    return this.createHTLC(config, privateKey, preimage)
  }

  /**
   * Wrapper function to open the websocket if necessary.
   *
   * @param config - HTLC information.
   * @param privateKey - Private key of the redeemer in WIF format.
   * @param preimage - Secret object.
   * @returns Success or failure.
   * @memberof BitsharesHTLC
   */
  public async redeem(config: HTLCConfig, privateKey: string, preimage: Secret): Promise<boolean> {
    if (this.websocket === null) {
      await this.openSocket(this.node)
    }

    return this.redeemHTLC(config, privateKey, preimage)
  }

  /**
   * Create and send the actual HTLC.
   *
   * Never call this function directly but use `create()` instead.
   * That's because the websocket must be open before creating an HTLC.
   *
   * @private
   * @param config - Configuration object for the HTLC.
   * @param privateKey - Private key of the creator in WIF format.
   * @param preimage - Secret object.
   * @returns Success status. Can be used for user feedback.
   * @memberof BitsharesHTLC
   */
  private async createHTLC(config: HTLCConfig, privateKey: string, preimage: Secret): Promise<boolean> {
    // TODO: Requires proper error handling. Right now it always returns true.
    const { sender, receiver, amount, asset, time } = config
    await ChainStore.init(false)

    const [senderAccount, toAccount, sendAsset] = await Promise.all([
      FetchChain("getAccount", sender),
      FetchChain("getAccount", receiver),
      FetchChain("getAsset", asset),
    ])

    const tr = new TransactionBuilder()
    /* eslint-disable @typescript-eslint/camelcase */
    tr.add_type_operation("htlc_create", {
      from: senderAccount.get("id"),
      to: toAccount.get("id"),
      amount: { amount: amount, asset_id: sendAsset.get("id") },
      preimage_hash: [2, preimage.hash],
      preimage_size: preimage.secret.length,
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
   * @param config - Configuration object for the HTLC.
   * @param privateKey - Private key of the redeemer in WIF format.
   * @param preimage - Secret object.
   * @returns Success status. Can be used for user feedback.
   * @memberof BitsharesHTLC
   */
  private async redeemHTLC(config: HTLCConfig, privateKey: string, preimage: Secret): Promise<boolean> {
    // TODO: Requires proper error handling. Right now it always returns true.
    await ChainStore.init(false)

    const [toAccount] = await Promise.all([FetchChain("getAccount", config.receiver)])

    const tr = new TransactionBuilder()
    /* eslint-disable @typescript-eslint/camelcase */
    tr.add_type_operation("htlc_redeem", {
      preimage: Buffer.from(preimage.secret).toString("hex"),
      htlc_id: await this.getID(config.sender, config.receiver, preimage),
      redeemer: toAccount.get("id"),
      extensions: null,
    })
    /* eslint-enable @typescript-eslint/camelcase */

    await tr.set_required_fees()
    tr.add_signer(PrivateKey.fromWif(privateKey))
    tr.broadcast()

    return true
  }

  /**
   * Get the HTLC BitShares ID.
   *
   * Only for internal purposes.
   * The HTLC ID is necessary to redeem an HTLC.
   * Websocket must be open.
   *
   * @private
   * @param sender - The sender of the HTLC.
   * @param receiver - The receiver of the HTLC.
   * @param preimage - Secret object.
   * @returns HTLC ID as string.
   * @memberof BitsharesHTLC
   */
  private async getID(sender: string, receiver: string, preimage: Secret): Promise<string> {
    // TODO: Requires proper error handling.
    const limit = 100 // TODO: Is 100 appropriate? -> Increase if not found

    const [senderAccount, toAccount] = await btsWebsocketApi.db.get_accounts([sender, receiver])

    const history = await btsWebsocketApi.history.get_relative_account_history(receiver, 0, limit, 0)
    const htlc = history.filter((element: any) => {
      return (
        typeof element.result[1] === "string" &&
        element.result[1].startsWith("1.16.") &&
        element.op[1].from === senderAccount.id &&
        element.op[1].to === toAccount.id &&
        element.op[1].preimage_hash[1] === preimage.hash
      )
    })
    if (htlc.length === 0) {
      throw new Error(`HTCL not found in the last ${limit} transactions.`)
    }

    return htlc[0].result[1]
  }
}
