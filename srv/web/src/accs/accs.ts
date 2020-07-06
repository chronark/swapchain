import readline from "readline"
import { Secret, getSecret } from "../pkg/secret/secret"
import * as bitcoin from "bitcoinjs-lib"
import { Apis as btsWebsocketApi } from "bitsharesjs-ws"
import BitcoinHTLC from "../pkg/bitcoin/htlc/btcHTLC"
import figlet from "figlet"
import BitsharesHTLC from "../pkg/bitshares/htlc/btsHTLC"
import { BlockStream } from "../pkg/bitcoin/api/blockstream"
import { Timer } from "./timer"
import { getAccount } from "../pkg/bitshares/util"
import { isValidPrivateKeyBTC, isValidPrivateKeyBTS, isValidPublicKeyBTC } from "../pkg/address/validator"

/**
 * Contains all necessary information to run an ACCS.
 *
 * @interface ACCSConfig
 */
export interface ACCSConfig {
  /**
   * The transaction mode (proposer or taker).
   */
  txMode: string

  /**
   * The transaction type (1 = BTS for BTC, 2 = BTC for BTS).
   */
  txType: string

  /**
   * The transaction type name to give user feedback.
   */
  txTypeName: string

  /**
   * The Bitcoin transaction priority (0 = high, 1 = medium, 2 = low)
   */
  priority: number

  /**
   * The user's own Bitshares account name.
   */
  accountBTS: string

  /**
   * The user's own Bitshares private key.
   */
  privateKeyBTS: string

  /**
   * The counterparty's Bitshares account name.
   */
  accountCounterpartyBTS: string

  /**
   * The amount the user wants to give.
   */
  amount: string

  /**
   * The exchange rate.
   */
  rateBTSBTC: number

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
  keyPairCounterpartyCompressedBTC: bitcoin.ECPairInterface

  /**
   * The timelock for the Bitcoin blockchain.
   */
  timelockBTC: number

  /**
   * The timelock for the Bitshares blockchain.
   */
  timelockBTS: number

  /**
   * A secret object with a random preimage and its corresponding SHA256 hash.
   */
  secret: Secret

  /**
   * The Bitcoin transaction id the user wants to spend.
   */
  txIdBTC: string
}

/**
 * Handler to create HTLCs on the respective blockchains to run an ACCS.
 *
 * @class ACCS
 */
export default class ACCS {
  private read: readline.Interface
  private networkName: string
  private net: bitcoin.networks.Network
  private asset: string
  private endpointBTS: string
  private config: ACCSConfig

  /**
   * Creates an instance of ACCS.
   *
   * @param network - The network type.
   * @memberof ACCS
   */
  constructor(network: string) {
    this.read = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    this.networkName = network

    if (network === "mainnet") {
      this.net = bitcoin.networks.bitcoin
      this.asset = "BTS"
      this.endpointBTS = "wss://api.dex.trading/"
    } else {
      this.net = bitcoin.networks.testnet
      this.asset = "TEST"
      this.endpointBTS = "wss://testnet.dex.trading"
    }

    this.config = {} as ACCSConfig
  }
  /**
   * Set the internal access config.
   *
   * @param config - Configuration object for the swap.
   * @memberof ACCS
   */
  public setConfig(config: ACCSConfig): void {
    this.config = config
  }

  /**
   * Gets input from stdin
   *
   * @param str - A question to ask the user.
   * @returns answer from the user
   * @memberof ACCS
   */
  public async askUser(str: string): Promise<string> {
    return new Promise((resolve) => this.read.question("\u001b[36;1m" + str + "\u001b[0m", resolve))
  }

  /**
   * Gets user input and stores everything in the config object.
   *
   * @returns ACCSConfig object.
   * @memberof ACCS
   */
  public async getUserInput(): Promise<ACCSConfig> {
    const config = {} as ACCSConfig

    // Print beautiful Swapchain banner and version info
    figlet("Swapchain", (err, banner) => {
      if (err) {
        throw new Error(err.toString())
      }
      console.log(banner)
    })

    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log("")
    console.log("version: sprint-10-release-candidate")
    console.log("Welcome to swapchain-cli.")
    console.log("")

    // Start getting user input
    config.txMode = (await this.askUser("Are you Proposer or Taker? (Proposer/Taker): ")).toLowerCase()
    if (config.txMode !== "proposer" && config.txMode !== "taker") {
      throw new Error("Invalid mode.")
    }

    config.txType = await this.askUser("Would you like to get (1) BTS for BTC or (2) BTC for BTS? (1/2): ")
    if (config.txType !== "1" && config.txType !== "2") {
      throw new Error("Invalid type.")
    }
    config.txTypeName = config.txType === "1" ? "BTS/BTC" : "BTC/BTS"
    // TODO: "Manual mode or ID from order book?" -> Connection to backend

    const priority = await this.askUser(
      "Please enter the priority of the Bitcoin transactions (0 = high, 1 = medium, 2 = low): ",
    )
    if (!["0", "1", "2"].includes(priority)) {
      throw new Error("Invalid priority. Must be 0, 1 or 2.")
    }

    config.priority = Number(priority)

    const privateKeyBTC = await this.askUser("Please enter your Bitcoin private key (WIF format): ")
    if(!isValidPrivateKeyBTC(privateKeyBTC, this.networkName)) {
      throw new Error("Invalid Bitcoin private key.")
    }

    config.privateKeyBTS = await this.askUser("Please enter your Bitshares private key (WIF format): ")
    if(!isValidPrivateKeyBTS(config.privateKeyBTS)) {
      throw new Error("Invalid Bitshares private key.")
    }

    const publicKeyCounterpartyBTC = await this.askUser("Please enter the Bitcoin public key of the counterparty: ")
    if(!isValidPublicKeyBTC(publicKeyCounterpartyBTC)) {
      throw new Error("Invalid Bitcoin public key.")
    }

    config.accountCounterpartyBTS = await this.askUser("Please enter the Bitshares account name of the counterparty: ")

    config.amount = await this.askUser(
      `Please enter the amount of ${config.txTypeName.slice(-3)} you want to exchange: `,
    )

    // Current market exchange rate: 500,000 BTS/BTC
    config.rateBTSBTC = 500_000
    // TODO: Make exchange rate dependend on order book or current market exchange rate

    let amountGet: number
    let amountGive: number
    if (config.txType === "1") {
      // amountGet: BTS
      // amountGive: BTC
      amountGive = parseFloat(config.amount)
      amountGet = amountGive * config.rateBTSBTC
      config.amountBTSMini = amountGet * 10e4 // TODO: Verify unit is same on Bitshares mainnet
      config.amountSatoshi = amountGive * 10e7
      // TODO: Substract fees
    } else {
      // amountGet: BTC
      // amountGive: BTS
      amountGive = parseFloat(config.amount)
      amountGet = amountGive / config.rateBTSBTC
      config.amountBTSMini = amountGive * 10e4 // TODO: Verify unit is same on Bitshares mainnet
      config.amountSatoshi = amountGet * 10e7
      // TODO: Substract fees
    }

    console.log(
      `You will get ${amountGet} ${config.txTypeName.substring(
        0,
        3,
      )} for giving ${amountGive} ${config.txTypeName.slice(-3)} (Current market exchange rate: 500,000 BTS/BTC).`,
    )

    config.accountBTS = await getAccount(config.privateKeyBTS, this.endpointBTS, this.networkName)

    const keyPairBTC = bitcoin.ECPair.fromWIF(privateKeyBTC, this.net)
    config.keyPairCompressedBTC = bitcoin.ECPair.fromPrivateKey(keyPairBTC.privateKey!, { compressed: true })

    config.keyPairCounterpartyCompressedBTC = bitcoin.ECPair.fromPublicKey(
      Buffer.from(publicKeyCounterpartyBTC, "hex"),
      {
        compressed: true,
      },
    )

    if (config.txMode === "proposer") {
      const timelock = await this.askUser(
        "Please enter the duration of the timelock (0 = long, 1 = medium, 2 = short): ",
      )

      if (!["0", "1", "2"].includes(timelock)) {
        throw new Error("Invalid timelock. Must be 0, 1 or 2.")
      }

      let sequence: number

      switch (timelock) {
        case "0":
          sequence = 20
          break
        case "1":
          sequence = 13
          break
        default:
          sequence = 6
      }

      const timer = new Timer(sequence, this.networkName, BlockStream)

      config.timelockBTC = timer.toBTC() // number of blocks to wait
      config.timelockBTS = await timer.toBTS() // seconds to wait

      config.secret = getSecret()
      console.log(`Please pass this secret hash to the counterparty: ${config.secret.hash.toString("hex")}`)
    } else {
      // Get timelock duration
      const timelock = await this.askUser("Please enter the duration of the timelock you received from the proposer: ")

      if (!["0", "1", "2"].includes(timelock)) {
        throw new Error("Invalid timelock. Must be 0, 1 or 2.")
      }

      let sequence: number

      switch (timelock) {
        case "0":
          sequence = 20
          break
        case "1":
          sequence = 13
          break
        default:
          sequence = 6
      }

      const timer = new Timer(sequence, this.networkName, BlockStream)

      config.timelockBTC = timer.toBTC() // number of blocks to wait
      config.timelockBTS = await timer.toBTS() // seconds to wait

      // Get secret hash
      const hashString = await this.askUser("Please enter the secret hash you received from the proposer: ")
      // SHA256 hash length must be 64
      if (hashString.length !== 64) {
        throw new Error("Invalid secret hash length.")
      }
      config.secret = {
        preimage: undefined,
        hash: Buffer.from(hashString, "hex"),
      }
    }

    if (config.txType === "1") {
      const p2wpkhSender = bitcoin.payments.p2wpkh({
        pubkey: config.keyPairCompressedBTC.publicKey,
        network: this.net,
      })
      console.log(
        `Please make sure that your Bitcoin p2wpkh address "${p2wpkhSender.address}" is sufficiently covered!`,
      )
      config.txIdBTC = await this.askUser(
        "Please enter the Bitcoin p2wpkh address' transaction ID which should be spent: ",
      )
      // TODO: Errorhandling for missing transaction (now: getWitnessUtxo fails with "length of undefined")
    }

    return config
  }

  /**
   * Handles ACCS for proposer who wants BTS for BTC.
   *
   * @memberof ACCS
   */
  public async proposeBTSForBTC(): Promise<void> {
    this.config.timelockBTS = Math.round(this.config.timelockBTS / 2)

    const htlcBTCProposer = new BitcoinHTLC(
      this.networkName,
      this.config.keyPairCompressedBTC,
      this.config.keyPairCounterpartyCompressedBTC,
      this.config.priority,
      BlockStream,
    )

    const refundHex = await htlcBTCProposer.create({
      transactionID: this.config.txIdBTC,
      amount: this.config.amountSatoshi,
      sequence: this.config.timelockBTC,
      hash: this.config.secret.hash,
    })

    console.log(`Successfully created HTLC on Bitcoin ${this.networkName}!`)
    console.log(
      `Looking for an HTLC for you on Bitshares ${this.networkName}. This can take up to ${
        this.config.timelockBTC
      } Bitcoin ${this.networkName} blocks (about ${Math.round(this.config.timelockBTS / 60)} min).`,
    )

    const htlcBTSProposer = new BitsharesHTLC(
      this.endpointBTS,
      this.config.accountCounterpartyBTS,
      this.config.accountBTS,
    )

    let success = false
    htlcBTSProposer.redeem(this.config.amountBTSMini, this.config.privateKeyBTS, this.config.secret).then((s) => {
      success = s
    })

    const maxBlockHeight = htlcBTCProposer.getFundingTxBlockHeight()! + this.config.timelockBTC
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
        `No HTLC found on Bitshares ${this.networkName}. Your HTLC was refunded with transaction ID ${refundTXId}.`,
      )
    }

    console.log(`Found the HTLC for you on Bitshares ${this.networkName}! Redeeming the HTLC...`)
  }

  /**
   * Handles ACCS for proposer who wants BTC for BTS.
   *
   * @memberof ACCS
   */
  public async proposeBTCForBTS(): Promise<void> {
    this.config.timelockBTC = Math.round(this.config.timelockBTC / 2)

    // Create BTS HTLC
    const htlcBTSProposer = new BitsharesHTLC(
      this.endpointBTS,
      this.config.accountBTS,
      this.config.accountCounterpartyBTS,
    )

    await htlcBTSProposer.create({
      amount: this.config.amountBTSMini,
      asset: this.asset,
      time: this.config.timelockBTS,
      hash: this.config.secret.hash,
      privateKey: this.config.privateKeyBTS,
    })

    console.log(`Successfully created HTLC on Bitshares ${this.networkName}!`)
    console.log(
      `Looking for an HTLC for you on Bitcoin ${this.networkName}. This can take up to ${Math.round(
        this.config.timelockBTS / 60,
      )} min.`,
    )

    const htlcBTCProposer = new BitcoinHTLC(
      this.networkName,
      this.config.keyPairCounterpartyCompressedBTC,
      this.config.keyPairCompressedBTC,
      this.config.priority,
      BlockStream,
    )

    const p2wsh = htlcBTCProposer.getP2WSH(this.config.secret.hash, this.config.timelockBTC)

    let timeToWait = Math.round(this.config.timelockBTS / 2) // We only check API every 2 seconds

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
      throw new Error(`No HTLC found on Bitcoin ${this.networkName}. Your HTLC will be automatically refunded.`)
    }

    // redeem
    await htlcBTCProposer.redeem(p2wsh, this.config.secret)
  }

  /**
   * Handles ACCS for taker who wants BTS for BTC.
   *
   * @memberof ACCS
   */
  public async takeBTSForBTC(): Promise<void> {
    this.config.timelockBTC = Math.round(this.config.timelockBTC / 2)

    // Look for BTS HTLC and only continue if there is one
    const htlcBTSTaker = new BitsharesHTLC(this.endpointBTS, this.config.accountCounterpartyBTS, this.config.accountBTS)

    let timeToWait = 120 / 2 // We only check API every 2 seconds

    console.log(
      `Looking for an HTLC for you on Bitshares ${this.networkName}. This can take up to ${timeToWait / 60} min.`,
    )

    let id = ""
    htlcBTSTaker.getID(this.config.amountBTSMini, this.config.secret.hash).then((res) => (id = res))

    while (!id && timeToWait > 0) {
      await new Promise((resolve) => setTimeout(resolve, 2_000))

      timeToWait--
    }

    if (!id) {
      htlcBTSTaker.stopLooking()
      throw new Error(`No HTLC found on Bitshares ${this.networkName}. Please contact proposer.`)
    }

    console.log(`Found the HTLC for you on Bitshares ${this.networkName}!`)

    const htlcBTCTaker = new BitcoinHTLC(
      this.networkName,
      this.config.keyPairCompressedBTC,
      this.config.keyPairCounterpartyCompressedBTC,
      this.config.priority,
      BlockStream,
    )

    const refundHex = await htlcBTCTaker.create({
      transactionID: this.config.txIdBTC,
      amount: this.config.amountSatoshi,
      sequence: this.config.timelockBTC,
      hash: this.config.secret.hash,
    })

    console.log("HTLC successfully created on Bitcoin. Waiting for counterparty to redeem it...")

    // Wait for Alice to redeem the BTC HTLC, then extract secret
    const p2wsh = htlcBTCTaker.getP2WSH(this.config.secret.hash, this.config.timelockBTC)

    let preimageFromBlockchain: string | null = null
    const maxBlockHeight = htlcBTCTaker.getFundingTxBlockHeight()! + this.config.timelockBTC
    let currentBlockHeight = 0

    while (preimageFromBlockchain === null && currentBlockHeight < maxBlockHeight) {
      currentBlockHeight = (await htlcBTCTaker.bitcoinAPI.getLastBlock()).height

      htlcBTCTaker.bitcoinAPI
        .getPreimageFromLastTransaction(p2wsh.address!)
        .then((preimage) => (preimageFromBlockchain = preimage))

      await new Promise((resolve) => setTimeout(resolve, 10_000))
    }

    if (preimageFromBlockchain === null) {
      const refundTXId = await htlcBTCTaker.bitcoinAPI.pushTX(refundHex)
      throw new Error(
        `HTLC was not redeemed in time by the counterparty. Your HTLC was refunded with transaction ID ${refundTXId}.`,
      )
    }

    this.config.secret.preimage = preimageFromBlockchain

    console.log(
      `Your Bitcoin HTLC was redeemed by the counterparty using the secret "${this.config.secret.preimage}". Redeeming the Bitshares HTLC...`,
    )

    // Redeem BTS HTLC with secret

    const success = await htlcBTSTaker.redeem(this.config.amountBTSMini, this.config.privateKeyBTS, this.config.secret)

    if (!success) {
      throw new Error("Could not redeem Bitshares HTLC. Please try manually.")
    }
  }

  /**
   * Handles ACCS for taker who wants BTC for BTS.
   *
   * @memberof ACCS
   */
  public async takeBTCForBTS(): Promise<void> {
    this.config.timelockBTS = Math.round(this.config.timelockBTS / 2)
    // Look for BTC HTLC and only continue if there is one
    // Use p2wsh address and fetch txs
    const htlcBTCTaker = new BitcoinHTLC(
      this.networkName,
      this.config.keyPairCounterpartyCompressedBTC,
      this.config.keyPairCompressedBTC,
      this.config.priority,
      BlockStream,
    )

    let timeToWait = 120 / 2 // We only check API every 2 seconds

    console.log(
      `Looking for an HTLC for you on Bitcoin ${this.networkName}. This can take up to ${timeToWait / 60} min.`,
    )

    const p2wsh = htlcBTCTaker.getP2WSH(this.config.secret.hash, this.config.timelockBTC)
    let txID: string | null = null
    htlcBTCTaker.bitcoinAPI.getValueFromLastTransaction(p2wsh.address!).then((res) => {
      txID = res.txID
    })

    while (txID === null && timeToWait > 0) {
      await new Promise((resolve) => setTimeout(resolve, 2_000))

      timeToWait--
    }

    if (timeToWait === 0) {
      throw new Error(`No HTLC found on Bitcoin ${this.networkName}. Please contact proposer.`)
    }

    console.log(`Found the HTLC for you on Bitcoin ${this.networkName}!`)
    // Create BTS HTLC
    const htlcBTSTaker = new BitsharesHTLC(this.endpointBTS, this.config.accountBTS, this.config.accountCounterpartyBTS)

    await htlcBTSTaker.create({
      amount: this.config.amountBTSMini,
      asset: this.asset,
      time: this.config.timelockBTS,
      hash: this.config.secret.hash,
      privateKey: this.config.privateKeyBTS,
    })

    console.log("HTLC successfully created on Bitshares. Waiting for counterparty to redeem it...")

    // Wait for Alice to redeem the BTS HTLC, then extract secret
    timeToWait = this.config.timelockBTS
    const [accountBTSObj, accountCounterpartyBTSObj] = await btsWebsocketApi.db.get_accounts([
      this.config.accountBTS,
      this.config.accountCounterpartyBTS,
    ])
    let htlc = []

    while (htlc.length < 1) {
      if (timeToWait === 0) {
        throw new Error("HTLC was not redeemed in time by the counterparty. Your HTLC will be automatically refunded.")
      }

      const history = await btsWebsocketApi.history.get_relative_account_history(this.config.accountBTS, 0, 100, 0)

      /* eslint-disable @typescript-eslint/no-explicit-any */
      htlc = history.filter((element: any) => {
        return (
          "preimage" in element.op[1] &&
          element.op[1].from === accountBTSObj.id &&
          element.op[1].to === accountCounterpartyBTSObj.id &&
          "htlc_preimage_hash" in element.op[1] &&
          element.op[1].htlc_preimage_hash[1] === this.config.secret.hash.toString("hex")
        )
      })
      /* eslint-enable @typescript-eslint/camelcase */

      // Wait three secondes, then try again
      await new Promise((resolve) => setTimeout(resolve, 1_000))

      timeToWait--
    }

    this.config.secret.preimage = Buffer.from(htlc[0].op[1].preimage, "hex").toString()

    console.log(
      `Your Bitshares HTLC was redeemed by the counterparty using the secret "${this.config.secret.preimage}". Redeeming the Bitcoin HTLC...`,
    )

    // Redeem BTC HTLC
    await htlcBTCTaker.redeem(p2wsh, this.config.secret)
  }

  /**
   * Calls respective swap method.
   *
   * @memberof ACCS
   */
  public async run(): Promise<void> {
    if (this.config.txType === "1" && this.config.txMode === "proposer") {
      await this.proposeBTSForBTC()
    } else if (this.config.txType === "2" && this.config.txMode === "proposer") {
      await this.proposeBTCForBTS()
    } else if (this.config.txType === "1" && this.config.txMode === "taker") {
      await this.takeBTSForBTC()
    } else if (this.config.txType === "2" && this.config.txMode === "taker") {
      await this.takeBTCForBTS()
    }
  }

  /**
   * Entrypoint for CLI.
   *
   * @memberof ACCS
   */
  public async main(): Promise<void> {
    this.config = await this.getUserInput()
    await this.run()
  }
}
