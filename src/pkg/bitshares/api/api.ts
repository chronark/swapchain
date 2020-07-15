import { Apis as btsWebsocketApi, ChainConfig } from "bitsharesjs-ws"
import { ChainStore, PrivateKey } from "bitsharesjs"

/**
 * API to connect to Bitshares blockchain
 *
 * Implemented as a singleton, so there is only one websocket at the same time.
 * Use getInstance to get an instance and not the constructor.
 */
export class BitsharesAPI {
  private static instance: BitsharesAPI

  /**
   * Do not use
   *
   * Only for testing purposes. If you call the constructor, the websocket will not be open.
   * Use getInstance instead.
   */
  /* eslint-disable-next-line @typescript-eslint/no-useless-constructor*/
  public constructor() {}

  /**
   * Initialize websocket if there is not already one
   *
   * @param node - The endpoint URL to connect.
   * @returns BitsharesAPI instance.
   */
  public static async getInstance(node: string): Promise<BitsharesAPI> {
    if (!BitsharesAPI.instance) {
      BitsharesAPI.instance = new BitsharesAPI()
      await btsWebsocketApi.instance(node, true).init_promise
      await ChainStore.init(false)
    }
    return BitsharesAPI.instance
  }

  /**
   * Get account ID
   *
   * @param accountName - The account name to fetch the ID for.
   * @returns The account ID.
   */
  public async getAccountID(accountName: string): Promise<string> {
    const accounts = await btsWebsocketApi.db.get_accounts([accountName])
    return accounts[0].id
  }

  /**
   * Get account history
   *
   * @param accountID - The account ID to fetch the history for.
   * @returns An array of transaction objects.
   */
  public async getHistory(accountID: string): Promise<Record<string, any>[]> {
    const limit = 100
    return await btsWebsocketApi.history.get_relative_account_history(accountID, 0, limit, 0)
  }

  /**
   * Get the HTLC BitShares ID
   *
   * @public
   * @param senderID - The sender's account ID.
   * @param receiverID - The receiver's account ID.
   * @param amount - The amount of assets of the HTLC.
   * @param hash - The SHA256 hash of the secret.
   * @param timelock - The timelock in seconds or undefined.
   * @returns HTLC ID of an instance.
   */
  public async getID(
    senderID: string,
    receiverID: string,
    amount: number,
    hash: Buffer,
    timelock?: number,
  ): Promise<string> {
    const history = await this.getHistory(receiverID)
    const htlc = history.filter((element: any) => {
      return (
        typeof element.result[1] === "string" &&
        element.op[1].from === senderID &&
        element.op[1].to === receiverID &&
        /* eslint-disable-next-line @typescript-eslint/camelcase */
        element.op[1].preimage_hash[1] === hash.toString("hex") &&
        element.op[1].amount.amount === amount &&
        /* eslint-disable-next-line @typescript-eslint/camelcase */
        // Timelock must be in 20% tolerance range
        (timelock ? element.op[1].claim_period_seconds >= timelock * 0.8 : true)
      )
    })

    if (htlc.length === 1) {
      return htlc[0].result[1]
    }

    throw new Error("Could not find id")
  }

  /**
   * Derive the account ID from a private key
   *
   * @param privateKey - Private key of a bitshares account.
   * @param network - Testnet or mainnet.
   * @returns The account ID for the private key.
   */
  async toAccountID(privateKey: string, network: string): Promise<string> {
    if (privateKey.length !== 51) {
      throw new Error("Invalid private key length.")
    }

    // Set chain IDs to get correct prefix for public key
    if (network === "mainnet") {
      ChainConfig.setChainId("4018d7844c78f6a6c41c6a552b898022310fc5dec06da467ee7905a8dad512c8")
    } else if (network === "testnet") {
      ChainConfig.setChainId("39f5e2ede1f8bc1a3a54a7914414e3779e33193f1f5693510e73cb7a87617447")
    } else {
      throw new Error("Invalid network name. Choose mainnet or testnet.")
    }

    const publicKey = PrivateKey.fromWif(privateKey).toPublicKey().toString()

    /* eslint-disable @typescript-eslint/camelcase */
    const accounts = await btsWebsocketApi.db.get_key_references([publicKey])

    if (typeof accounts[0][0] === "undefined") {
      throw new Error(`Could not find any accounts for private key ${privateKey} on ${network}`)
    }

    return accounts[0][0]
  }

  /**
   * Get preimage from HTLC on blockchain
   *
   * @param  senderID - ID of the sending account.
   * @param  receiverID - ID of the receiving account.
   * @param  secretHash - Hashed preimage to verify the HTLC.
   * @returns Preimage from the HTLC.
   * @memberof BitsharesAPI
   */
  async getPreimageFromHTLC(senderID: string, receiverID: string, secretHash: string): Promise<string> {
    const history = await this.getHistory(receiverID)

    const htlc = history.filter((element: any) => {
      return (
        "preimage" in element.op[1] &&
        element.op[1].from === senderID &&
        element.op[1].to === receiverID &&
        "htlc_preimage_hash" in element.op[1] &&
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        element.op[1].htlc_preimage_hash[1] === secretHash
      )
    })

    if (htlc.length > 0) {
      return Buffer.from(htlc[0].op[1].preimage, "hex").toString()
    }

    throw new Error("Could not find HTLC on blockchain")
  }
}
