import { Secret } from "../pkg/secret/secret"
import * as bitcoin from "bitcoinjs-lib"
import { Apis as btsWebsocketApi } from "bitsharesjs-ws"
import BitcoinHTLC from "../pkg/bitcoin/htlc/btcHTLC"
import BitsharesHTLC from "../pkg/bitshares/htlc/btsHTLC"
import { BlockStream } from "../pkg/bitcoin/api/blockstream"
import { Timer } from "./timer"
import { getAccount } from "../pkg/bitshares/util"

export interface ACCSFields {
  /**
   * The transaction mode. Either proposer or accepter.
   */
  mode: string

  /**
   * The network name. Either mainnet or testnet.
   */
  networkToTrade: string

  /**
   * The currency to give. Either BTC or BTS.
   */
  currencyToGive: string

  /**
   * The amount to send.
   */
  amountToSend: number

  /**
   * The exchange rate both parties agreed on.
   */
  rate: number

  /**
   * The amount to receive.
   */
  amountToReceive: number

  /**
   * The Bitcoin private key.
   */
  bitcoinPrivateKey: string

  /**
   * The Bitshares private key.
   */
  bitsharesPrivateKey: string

  /**
   * The Bitcoin public key of the counterparty.
   */
  counterpartyBitcoinPublicKey: string

  /**
   * The Bitshares account name of the counterparty.
   */
  counterpartyBitsharesAccountName: string

  /**
   * The Bitcoin transaction ID to spend.
   */
  bitcoinTxID: string

  /**
   * The timelock of the transactions. Either 20 (long), 13 (medium) or 6 (short).
   */
  timelock: number

  /**
   * The priority of the transactions. Either 0 (high), 1 (medium) or 2 (low).
   */
  priority: number

  /**
   * A secret object with a random preimage and its corresponding SHA256 hash.
   */
  secret: Secret
}

/**
 * Contains all necessary information to run an ACCS.
 *
 * @interface ACCSConfig
 */
export interface ACCSConfig {
  /**
   * The transaction mode. Either proposer or accepter.
   */
  mode: string

  /**
   * The transaction type (1 = BTS for BTC, 2 = BTC for BTS).
   */
  type: string

  /**
   * The Bitcoin transaction priority (0 = high, 1 = medium, 2 = low)
   */
  priority: number

  /**
   * The user's own Bitshares account name.
   */
  bitsharesAccount: string

  /**
   * The user's own Bitshares private key.
   */
  bitsharesPrivateKey: string

  /**
   * The counterparty's Bitshares account name.
   */
  counterpartyBitsharesAccountName: string

  /**
   * The amount of Bitshares in 1/100000 BTS.
   */
  amountBTSMini: number

  /**
   * The amount of Bitcoin in Satoshi 1/100000000 BTC.
   */
  amountSatoshi: number

  /**
   * The user's own Bitcoin compressed keypair.
   */
  keyPairCompressedBTC: bitcoin.ECPairInterface

  /**
   * The counterparty's Bitcoin compressed keypair. Only contains a public key!
   */
  counterpartyKeyPairCompressedBTC: bitcoin.ECPairInterface

  /**
   * The timelock for the Bitcoin blockchain in blocks.
   */
  timelockBTC: number

  /**
   * The timelock for the Bitshares blockchain in seconds.
   */
  timelockBTS: number

  /**
   * A secret object with a random preimage and its corresponding SHA256 hash.
   */
  secret: Secret

  /**
   * The Bitcoin transaction id the user wants to spend.
   */
  bitcoinTxID: string

  /**
   * The Bitcoin network object.
   */
  network: bitcoin.networks.Network

  /**
   * The network name. Either mainnet or testnet.
   */
  networkName: string

  /**
   * The asset on Bitshares blockchain. Either BTS or TEST.
   */
  bitsharesAsset: string

  /**
   * The endpoint address of the Bitshares node to connect to.
   */
  bitsharesEndpoint: string
}

/**
 * Handler to create HTLCs on the respective blockchains to run an ACCS.
 *
 * @class ACCS
 */
export default class ACCS {
  /**
   * Parse user input to create config
   *
   * @param fields
   */
  public static async parseUserInput(fields: ACCSFields): Promise<ACCSConfig> {
    const config = {} as ACCSConfig

    if (fields.networkToTrade === "mainnet") {
      config.network = bitcoin.networks.bitcoin
      config.bitsharesAsset = "BTS"
      config.bitsharesEndpoint = "wss://api.dex.trading/"
    } else {
      config.network = bitcoin.networks.testnet
      config.bitsharesAsset = "TEST"
      config.bitsharesEndpoint = "wss://testnet.dex.trading"
    }

    config.mode = fields.mode
    config.type = fields.currencyToGive
    config.priority = fields.priority
    config.bitsharesAccount = await getAccount(
      fields.bitsharesPrivateKey,
      config.bitsharesEndpoint,
      fields.networkToTrade,
    )
    config.bitsharesPrivateKey = fields.bitsharesPrivateKey
    config.counterpartyBitsharesAccountName = fields.counterpartyBitsharesAccountName

    if (config.type === "1") {
      config.amountBTSMini = fields.amountToReceive * 10e4
      config.amountSatoshi = fields.amountToSend * 10e7
    } else {
      config.amountBTSMini = fields.amountToSend * 10e4
      config.amountSatoshi = fields.amountToReceive * 10e7
    }

    const keyPairBTC = bitcoin.ECPair.fromWIF(fields.bitcoinPrivateKey, config.network)
    config.keyPairCompressedBTC = bitcoin.ECPair.fromPrivateKey(keyPairBTC.privateKey!, { compressed: true })

    config.counterpartyKeyPairCompressedBTC = bitcoin.ECPair.fromPublicKey(
      Buffer.from(fields.counterpartyBitcoinPublicKey, "hex"),
      {
        compressed: true,
      },
    )

    config.bitcoinTxID = fields.bitcoinTxID

    const timer = new Timer(fields.timelock, fields.networkToTrade, BlockStream)

    config.timelockBTC = timer.toBTC() // number of blocks to wait
    config.timelockBTS = await timer.toBTS() // seconds to wait

    config.secret = fields.secret

    return config
  }

  /**
   * Handles ACCS for proposer who wants BTS for BTC.
   *
   * @memberof ACCS
   */
  public static async proposeBTSForBTC(config: ACCSConfig): Promise<void> {
    config.timelockBTS = Math.round(config.timelockBTS / 2)

    const htlcBTCProposer = new BitcoinHTLC(
      config.networkName,
      config.keyPairCompressedBTC,
      config.counterpartyKeyPairCompressedBTC,
      config.priority,
      BlockStream,
    )

    const refundHex = await htlcBTCProposer.create({
      transactionID: config.bitcoinTxID,
      amount: config.amountSatoshi,
      sequence: config.timelockBTC,
      hash: config.secret.hash,
    })

    console.log(`Successfully created HTLC on Bitcoin ${config.networkName}!`)
    console.log(
      `Looking for an HTLC for you on Bitshares ${config.networkName}. This can take up to ${
        config.timelockBTC
      } Bitcoin ${config.networkName} blocks (about ${Math.round(config.timelockBTS / 60)} min).`,
    )

    const htlcBTSProposer = new BitsharesHTLC(
      config.bitsharesEndpoint,
      config.counterpartyBitsharesAccountName,
      config.bitsharesAccount,
    )

    let success = false
    htlcBTSProposer.redeem(config.amountBTSMini, config.bitsharesPrivateKey, config.secret).then((s) => {
      success = s
    })

    const maxBlockHeight = htlcBTCProposer.getFundingTxBlockHeight()! + config.timelockBTC
    let currentBlockHeight = 0
    // If no HTLC found immediately, continue looking until timelock
    while (!success && currentBlockHeight < maxBlockHeight) {
      currentBlockHeight = (await htlcBTCProposer.bitcoinAPI.getLastBlock()).height

      await new Promise((resolve) => setTimeout(resolve, 10_000))
    }

    if (!success) {
      htlcBTSProposer.stopLooking()
      const refundTXId = await htlcBTCProposer.bitcoinAPI.pushTX(refundHex)
      throw new Error(
        `No HTLC found on Bitshares ${config.networkName}. Your HTLC was refunded with transaction ID ${refundTXId}.`,
      )
    }

    console.log(`Found the HTLC for you on Bitshares ${config.networkName}! Redeeming the HTLC...`)
  }

  /**
   * Handles ACCS for proposer who wants BTC for BTS.
   *
   * @memberof ACCS
   */
  public static async proposeBTCForBTS(config: ACCSConfig): Promise<void> {
    config.timelockBTC = Math.round(config.timelockBTC / 2)

    // Create BTS HTLC
    const htlcBTSProposer = new BitsharesHTLC(
      config.bitsharesEndpoint,
      config.bitsharesAccount,
      config.counterpartyBitsharesAccountName,
    )

    await htlcBTSProposer.create({
      amount: config.amountBTSMini,
      asset: config.bitsharesAsset,
      time: config.timelockBTS,
      hash: config.secret.hash,
      privateKey: config.bitsharesPrivateKey,
    })

    console.log(`Successfully created HTLC on Bitshares ${config.networkName}!`)
    console.log(
      `Looking for an HTLC for you on Bitcoin ${config.networkName}. This can take up to ${Math.round(
        config.timelockBTS / 60,
      )} min.`,
    )

    const htlcBTCProposer = new BitcoinHTLC(
      config.networkName,
      config.counterpartyKeyPairCompressedBTC,
      config.keyPairCompressedBTC,
      config.priority,
      BlockStream,
    )

    const p2wsh = htlcBTCProposer.getP2WSH(config.secret.hash, config.timelockBTC)

    let timeToWait = Math.round(config.timelockBTS / 2) // We only check API every 2 seconds

    let txID: string | null = null

    while (txID === null && timeToWait > 0) {
      htlcBTCProposer.bitcoinAPI
        .getValueFromLastTransaction(p2wsh.address!)
        .then((res) => {
          txID = res.txID
        })
        .catch((err: Error) => {}) // This error is intentional and expected to occur for most iterations

      await new Promise((resolve) => setTimeout(resolve, 2_000))

      timeToWait--
    }

    if (txID === null) {
      throw new Error(`No HTLC found on Bitcoin ${config.networkName}. Your HTLC will be automatically refunded.`)
    }

    // redeem
    await htlcBTCProposer.redeem(p2wsh, config.secret)
  }

  /**
   * Handles ACCS for accepter who wants BTS for BTC.
   *
   * @memberof ACCS
   */
  public static async takeBTSForBTC(config: ACCSConfig): Promise<void> {
    config.timelockBTC = Math.round(config.timelockBTC / 2)

    // Look for BTS HTLC and only continue if there is one
    const htlcBTSAccepter = new BitsharesHTLC(
      config.bitsharesEndpoint,
      config.counterpartyBitsharesAccountName,
      config.bitsharesAccount,
    )

    let timeToWait = 120 / 2 // We only check API every 2 seconds

    console.log(
      `Looking for an HTLC for you on Bitshares ${config.networkName}. This can take up to ${timeToWait / 60} min.`,
    )

    let id = ""
    htlcBTSAccepter.getID(config.amountBTSMini, config.secret.hash).then((res) => (id = res))

    while (!id && timeToWait > 0) {
      await new Promise((resolve) => setTimeout(resolve, 2_000))

      timeToWait--
    }

    if (!id) {
      htlcBTSAccepter.stopLooking()
      throw new Error(`No HTLC found on Bitshares ${config.networkName}. Please contact proposer.`)
    }

    console.log(`Found the HTLC for you on Bitshares ${config.networkName}!`)

    const htlcBTCAccepter = new BitcoinHTLC(
      config.networkName,
      config.keyPairCompressedBTC,
      config.counterpartyKeyPairCompressedBTC,
      config.priority,
      BlockStream,
    )

    const refundHex = await htlcBTCAccepter.create({
      transactionID: config.bitcoinTxID,
      amount: config.amountSatoshi,
      sequence: config.timelockBTC,
      hash: config.secret.hash,
    })

    console.log("HTLC successfully created on Bitcoin. Waiting for counterparty to redeem it...")

    // Wait for Alice to redeem the BTC HTLC, then extract secret
    const p2wsh = htlcBTCAccepter.getP2WSH(config.secret.hash, config.timelockBTC)

    let preimageFromBlockchain: string | null = null
    const maxBlockHeight = htlcBTCAccepter.getFundingTxBlockHeight()! + config.timelockBTC
    let currentBlockHeight = 0

    while (preimageFromBlockchain === null && currentBlockHeight < maxBlockHeight) {
      currentBlockHeight = (await htlcBTCAccepter.bitcoinAPI.getLastBlock()).height

      htlcBTCAccepter.bitcoinAPI
        .getPreimageFromLastTransaction(p2wsh.address!)
        .then((preimage) => (preimageFromBlockchain = preimage))

      await new Promise((resolve) => setTimeout(resolve, 10_000))
    }

    if (preimageFromBlockchain === null) {
      const refundTXId = await htlcBTCAccepter.bitcoinAPI.pushTX(refundHex)
      if (!refundTXId) {
        throw new Error(`Could not push refundHex to endpoint. Hex for refund transaction: ${refundHex}`)
      }
      throw new Error(
        `HTLC was not redeemed in time by the counterparty. Your HTLC was refunded with transaction ID ${refundTXId}.`,
      )
    }

    config.secret.preimage = preimageFromBlockchain

    console.log(
      `Your Bitcoin HTLC was redeemed by the counterparty using the secret "${config.secret.preimage}". Redeeming the Bitshares HTLC...`,
    )

    // Redeem BTS HTLC with secret

    const success = await htlcBTSAccepter.redeem(config.amountBTSMini, config.bitsharesPrivateKey, config.secret)

    if (!success) {
      throw new Error("Could not redeem Bitshares HTLC. Please try manually.")
    }
  }

  /**
   * Handles ACCS for accepter who wants BTC for BTS.
   *
   * @memberof ACCS
   */
  public static async takeBTCForBTS(config: ACCSConfig): Promise<void> {
    config.timelockBTS = Math.round(config.timelockBTS / 2)
    // Look for BTC HTLC and only continue if there is one
    // Use p2wsh address and fetch txs
    const htlcBTCAccepter = new BitcoinHTLC(
      config.networkName,
      config.counterpartyKeyPairCompressedBTC,
      config.keyPairCompressedBTC,
      config.priority,
      BlockStream,
    )

    let timeToWait = 120 / 2 // We only check API every 2 seconds

    console.log(
      `Looking for an HTLC for you on Bitcoin ${config.networkName}. This can take up to ${timeToWait / 60} min.`,
    )

    const p2wsh = htlcBTCAccepter.getP2WSH(config.secret.hash, config.timelockBTC)
    let txID: string | null = null
    htlcBTCAccepter.bitcoinAPI.getValueFromLastTransaction(p2wsh.address!).then((res) => {
      txID = res.txID
    })

    while (txID === null && timeToWait > 0) {
      await new Promise((resolve) => setTimeout(resolve, 2_000))

      timeToWait--
    }

    if (timeToWait === 0) {
      throw new Error(`No HTLC found on Bitcoin ${config.networkName}. Please contact proposer.`)
    }

    console.log(`Found the HTLC for you on Bitcoin ${config.networkName}!`)
    // Create BTS HTLC
    const htlcBTSAccepter = new BitsharesHTLC(
      config.bitsharesEndpoint,
      config.bitsharesAccount,
      config.counterpartyBitsharesAccountName,
    )

    await htlcBTSAccepter.create({
      amount: config.amountBTSMini,
      asset: config.bitsharesAsset,
      time: config.timelockBTS,
      hash: config.secret.hash,
      privateKey: config.bitsharesPrivateKey,
    })

    console.log("HTLC successfully created on Bitshares. Waiting for counterparty to redeem it...")

    // Wait for Alice to redeem the BTS HTLC, then extract secret
    timeToWait = config.timelockBTS
    const [bitsharesAccountObj, counterpartyBitsharesAccountNameObj] = await btsWebsocketApi.db.get_accounts([
      config.bitsharesAccount,
      config.counterpartyBitsharesAccountName,
    ])
    let htlc = []

    while (htlc.length < 1) {
      if (timeToWait === 0) {
        throw new Error("HTLC was not redeemed in time by the counterparty. Your HTLC will be automatically refunded.")
      }

      const history = await btsWebsocketApi.history.get_relative_account_history(config.bitsharesAccount, 0, 100, 0)

      /* eslint-disable @typescript-eslint/no-explicit-any */
      htlc = history.filter((element: any) => {
        return (
          "preimage" in element.op[1] &&
          element.op[1].from === bitsharesAccountObj.id &&
          element.op[1].to === counterpartyBitsharesAccountNameObj.id &&
          "htlc_preimage_hash" in element.op[1] &&
          element.op[1].htlc_preimage_hash[1] === config.secret.hash.toString("hex")
        )
      })
      /* eslint-enable @typescript-eslint/camelcase */

      // Wait three secondes, then try again
      await new Promise((resolve) => setTimeout(resolve, 1_000))

      timeToWait--
    }

    config.secret.preimage = Buffer.from(htlc[0].op[1].preimage, "hex").toString()

    console.log(
      `Your Bitshares HTLC was redeemed by the counterparty using the secret "${config.secret.preimage}". Redeeming the Bitcoin HTLC...`,
    )

    // Redeem BTC HTLC
    await htlcBTCAccepter.redeem(p2wsh, config.secret)
  }

  /**
   * Entrypoint for web app and CLI. Calls respective parse and swap methods.
   *
   * @param fields - The raw user input object.
   * @memberof ACCS
   */
  public static async run(fields: ACCSFields): Promise<void> {
    const config = await ACCS.parseUserInput(fields)

    if (config.type === "1" && config.mode === "proposer") {
      await ACCS.proposeBTSForBTC(config)
    } else if (config.type === "2" && config.mode === "proposer") {
      await ACCS.proposeBTCForBTS(config)
    } else if (config.type === "1" && config.mode === "accepter") {
      await ACCS.takeBTSForBTC(config)
    } else if (config.type === "2" && config.mode === "accepter") {
      await ACCS.takeBTCForBTS(config)
    }
  }
}
