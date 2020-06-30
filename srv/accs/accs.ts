import readline from "readline"
import { Secret, getSecret } from "../../pkg/secret/secret"
import * as bitcoin from "bitcoinjs-lib"
import { Apis as btsWebsocketApi } from "bitsharesjs-ws"
import BitcoinHTLC from "../../pkg/bitcoin/htlc/btcHTLC"
import figlet from "figlet"
import BitsharesHTLC from "../../pkg/bitshares/htlc/btsHTLC"
import BlockStream from "../../pkg/bitcoin/api/blockstream"

/**
 * Contains all necessary information to run an ACCS.
 *
 * @interface ACCSConfig
 */
export interface ACCSConfig {
  txMode: string
  txType: string
  txTypeName: string
  accountBTS: string
  privateKeyBTS: string
  accountCounterpartyBTS: string
  amount: string
  rateBTSBTC: number
  amountBTSMini: number
  amountSatoshi: number
  keyPairCompressedBTC: bitcoin.ECPairInterface
  keyPairCounterpartyCompressedBTC: bitcoin.ECPairInterface
  speedBTC: number
  timelockBTC: number
  timelockBTS: number
  secret: Secret
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
  private endpointBTC: string
  private accsConfig: ACCSConfig

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
      this.endpointBTC = "https://blockstream.info/api/"
    } else {
      this.net = bitcoin.networks.testnet
      this.asset = "TEST"
      this.endpointBTS = "wss://testnet.dex.trading"
      this.endpointBTC = "https://blockstream.info/testnet/api/"
    }

    this.accsConfig = {} as ACCSConfig
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
    const accsConfig = {} as ACCSConfig

    // Print beautiful Swapchain banner and version info
    figlet("Swapchain", (err, banner) => {
      if (err) {
        throw new Error(err.toString())
      }
      console.log(banner)
    })

    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log("")
    console.log("version: sprint-08-release-candidate")
    console.log("Welcome to swapchain-cli.")
    console.log("")

    // Start getting user input
    accsConfig.txMode = (await this.askUser("Are you Proposer or Taker? (Proposer/Taker): ")).toLowerCase()
    if (accsConfig.txMode !== "proposer" && accsConfig.txMode !== "taker") {
      throw new Error("Invalid mode.")
    }

    accsConfig.txType = await this.askUser("Would you like to get (1) BTS for BTC or (2) BTC for BTS? (1/2): ")
    if (accsConfig.txType !== "1" && accsConfig.txType !== "2") {
      throw new Error("Invalid type.")
    }
    accsConfig.txTypeName = accsConfig.txType === "1" ? "BTS/BTC" : "BTC/BTS"
    // TODO: "Manual mode or ID from order book?" -> Connection to backend

    accsConfig.accountBTS = await this.askUser("Please enter your Bitshares account name: ")

    accsConfig.privateKeyBTS = await this.askUser(
      "Please enter your private key (WIF format) associated with the given Bitshares account: ",
    )

    const privateKeyBTC = await this.askUser("Please enter your Bitcoin private key (WIF format): ")

    accsConfig.accountCounterpartyBTS = await this.askUser(
      "Please enter the Bitshares account name of the counterparty: ",
    )

    const publicKeyCounterpartyBTC = await this.askUser("Please enter the Bitcoin public key of the counterparty: ")
    if (!(publicKeyCounterpartyBTC.length === 66 || publicKeyCounterpartyBTC.length === 130)) {
      throw new Error("Invalid Bitcoin public key.")
    }

    accsConfig.amount = await this.askUser(
      `Please enter the amount of ${accsConfig.txTypeName.slice(-3)} you want to exchange: `,
    )

    // Current market exchange rate: 500,000 BTS/BTC
    accsConfig.rateBTSBTC = 500_000
    // TODO: Make exchange rate dependend on order book or current market exchange rate

    let amountGet: number
    let amountGive: number
    if (accsConfig.txType === "1") {
      // amountGet: BTS
      // amountGive: BTC
      amountGive = parseFloat(accsConfig.amount)
      amountGet = amountGive * accsConfig.rateBTSBTC
      accsConfig.amountBTSMini = amountGet * 10e4 // TODO: Verify unit is same on Bitshares mainnet
      accsConfig.amountSatoshi = amountGive * 10e7
      // TODO: Substract fees
    } else {
      // amountGet: BTC
      // amountGive: BTS
      amountGive = parseFloat(accsConfig.amount)
      amountGet = amountGive / accsConfig.rateBTSBTC
      accsConfig.amountBTSMini = amountGive * 10e4 // TODO: Verify unit is same on Bitshares mainnet
      accsConfig.amountSatoshi = amountGet * 10e7
      // TODO: Substract fees
    }

    console.log(
      `You will get ${amountGet} ${accsConfig.txTypeName.substring(
        0,
        3,
      )} for giving ${amountGive} ${accsConfig.txTypeName.slice(-3)} (Current market exchange rate: 500,000 BTS/BTC).`,
    )

    const keyPairBTC = bitcoin.ECPair.fromWIF(privateKeyBTC, this.net)
    accsConfig.keyPairCompressedBTC = bitcoin.ECPair.fromPrivateKey(keyPairBTC.privateKey!, { compressed: true })

    accsConfig.keyPairCounterpartyCompressedBTC = bitcoin.ECPair.fromPublicKey(
      Buffer.from(publicKeyCounterpartyBTC, "hex"),
      {
        compressed: true,
      },
    )

    // Average Speed of BTC blockchain
    // Bitcoin block speed fluctuates strongly,
    accsConfig.speedBTC = 600 // FIXME: Add timer

    accsConfig.timelockBTC = 6 // number of blocks to wait
    accsConfig.timelockBTS = Math.round(accsConfig.timelockBTC * accsConfig.speedBTC) // seconds to wait

    if (accsConfig.txMode === "proposer") {
      accsConfig.secret = getSecret()
      console.log(`Please pass this secret hash to the counterparty: ${accsConfig.secret.hash.toString("hex")}`)
    } else {
      // Get secret hash
      const hashString = await this.askUser("Please enter the secret hash you received from the proposer: ")
      // SHA256 hash length must be 64
      if (hashString.length !== 64) {
        throw new Error("Invalid secret hash length.")
      }
      accsConfig.secret = {
        preimage: undefined,
        hash: Buffer.from(hashString, "hex"),
      }
    }

    if (accsConfig.txType === "1") {
      const p2wpkhSender = bitcoin.payments.p2wpkh({
        pubkey: accsConfig.keyPairCompressedBTC.publicKey,
        network: this.net,
      })
      console.log(
        `Please make sure that your Bitcoin p2wpkh address "${p2wpkhSender.address}" is sufficiently covered!`,
      )
      accsConfig.txIdBTC = await this.askUser(
        "Please enter the Bitcoin p2wpkh address' transaction ID which should be spent: ",
      )
      // TODO: Errorhandling for missing transaction (now: getWitnessUtxo fails with "length of undefined")
    }

    return accsConfig
  }

  /**
   * Handles ACCS for proposer who wants BTS for BTC.
   *
   * @memberof ACCS
   */
  public async proposeBTSForBTC(): Promise<void> {
    this.accsConfig.timelockBTS = Math.round(this.accsConfig.timelockBTS / 2)

    const htlcBTCProposer = new BitcoinHTLC(
      this.networkName,
      this.accsConfig.keyPairCompressedBTC,
      this.accsConfig.keyPairCounterpartyCompressedBTC,
      BlockStream,
    )

    const status = await htlcBTCProposer.create({
      transactionID: this.accsConfig.txIdBTC,
      amount: this.accsConfig.amountSatoshi,
      sequence: this.accsConfig.timelockBTC,
      hash: this.accsConfig.secret.hash,
    })

    if (status === 1) {
      throw new Error("The output of the transaction ID given does not have sufficient balance.")
    } else if (status === 2) {
      throw new Error("Pushing funding transaction failed. Is the endpoint down?")
    } else if (status === 3) {
      throw new Error("Posting refundHex to database failed. Please refund HTLC manually.")
    }

    console.log(`Successfully created HTLC on Bitcoin ${this.networkName}!`)
    console.log(
      `Looking for an HTLC for you on Bitshares ${this.networkName}. This can take up to ${
        this.accsConfig.timelockBTC
      } Bitcoin ${this.networkName} blocks (about ${Math.round(
        (this.accsConfig.timelockBTC * this.accsConfig.speedBTC) / 60,
      )} min).`,
    )

    const htlcBTSProposer = new BitsharesHTLC(
      this.endpointBTS,
      this.accsConfig.accountCounterpartyBTS,
      this.accsConfig.accountBTS,
    )

    let success = false
    htlcBTSProposer
      .redeem(this.accsConfig.amountBTSMini, this.accsConfig.privateKeyBTS, this.accsConfig.secret)
      .then((s) => {
        success = s
      })

    const maxBlockHeight = htlcBTCProposer.getFundingTxBlockHeight()! + this.accsConfig.timelockBTC
    let currentBlockHeight = 0

    // If no HTLC found immediately, continue looking until timelock
    while (!success && currentBlockHeight < maxBlockHeight) {
      currentBlockHeight = (await htlcBTCProposer.bitcoinAPI.getLastBlock()).height
      console.warn(`${currentBlockHeight} vs. ${maxBlockHeight}`)

      await new Promise((resolve) => setTimeout(resolve, 10_000))
    }

    if (!success) {
      htlcBTSProposer.stopLooking()
      throw new Error(`No HTLC found on Bitshares ${this.networkName}. Your HTLC will be automatically refunded.`)
    }

    console.log(`Found the HTLC for you on Bitshares ${this.networkName}! Redeeming the HTLC...`)
  }

  /**
   * Handles ACCS for proposer who wants BTC for BTS.
   *
   * @memberof ACCS
   */
  public async proposeBTCForBTS(): Promise<void> {
    this.accsConfig.timelockBTC = Math.round(this.accsConfig.timelockBTC / 2)

    // Create BTS HTLC
    const htlcBTSProposer = new BitsharesHTLC(
      this.endpointBTS,
      this.accsConfig.accountBTS,
      this.accsConfig.accountCounterpartyBTS,
    )

    await htlcBTSProposer.create({
      amount: this.accsConfig.amountBTSMini,
      asset: this.asset,
      time: this.accsConfig.timelockBTS,
      hash: this.accsConfig.secret.hash,
      privateKey: this.accsConfig.privateKeyBTS,
    })

    console.log(`Successfully created HTLC on Bitshares ${this.networkName}!`)
    console.log(
      `Looking for an HTLC for you on Bitcoin ${this.networkName}. This can take up to ${Math.round(
        this.accsConfig.timelockBTS / 60,
      )} min.`,
    )

    const htlcBTCProposer = new BitcoinHTLC(
      this.networkName,
      this.accsConfig.keyPairCounterpartyCompressedBTC,
      this.accsConfig.keyPairCompressedBTC,
      BlockStream,
    )

    const p2wsh = htlcBTCProposer.getP2WSH(this.accsConfig.secret.hash, this.accsConfig.timelockBTC)

    let timeToWait = Math.round(this.accsConfig.timelockBTS / 2) // We only check API every 2 seconds

    let txID: string | null = null

    while (txID === null && timeToWait > 0) {
      htlcBTCProposer.bitcoinAPI
        .getValueFromLastTransaction(p2wsh.address!)
        .then((res) => {
          txID = res.txID
        })
        .catch() // This error is intentional and expected to occur for most iterations

      await new Promise((resolve) => setTimeout(resolve, 2_000))

      timeToWait--
    }

    if (txID === null) {
      throw new Error(`No HTLC found on Bitcoin ${this.networkName}. Your HTLC will be automatically refunded.`)
    }

    // redeem
    const status = await htlcBTCProposer.redeem(p2wsh, this.accsConfig.secret)

    if (status === 1) {
      throw new Error("Could not redeem Bitcoin HTLC. Please try manually.")
    }
  }

  /**
   * Handles ACCS for taker who wants BTS for BTC.
   *
   * @memberof ACCS
   */
  public async takeBTSForBTC(): Promise<void> {
    this.accsConfig.timelockBTC = Math.round(this.accsConfig.timelockBTC / 2)

    // Look for BTS HTLC and only continue if there is one
    const htlcBTSTaker = new BitsharesHTLC(
      this.endpointBTS,
      this.accsConfig.accountCounterpartyBTS,
      this.accsConfig.accountBTS,
    )

    let timeToWait = 120 / 2 // We only check API every 2 seconds

    console.log(
      `Looking for an HTLC for you on Bitshares ${this.networkName}. This can take up to ${timeToWait / 60} min.`,
    )

    let id = ""
    htlcBTSTaker.getID(this.accsConfig.amountBTSMini, this.accsConfig.secret.hash).then((res) => (id = res))

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
      this.accsConfig.keyPairCompressedBTC,
      this.accsConfig.keyPairCounterpartyCompressedBTC,
      BlockStream,
    )

    const status = await htlcBTCTaker.create({
      transactionID: this.accsConfig.txIdBTC,
      amount: this.accsConfig.amountSatoshi,
      sequence: this.accsConfig.timelockBTC,
      hash: this.accsConfig.secret.hash,
    })

    if (status === 1) {
      throw new Error("The output of the transaction ID given does not have sufficient balance.")
    } else if (status === 2) {
      throw new Error("Pushing funding transaction failed. Is the endpoint down?")
    } else if (status === 3) {
      throw new Error("Posting refundHex to database failed. Please refund HTLC manually.")
    }

    console.log("HTLC successfully created on Bitcoin. Waiting for counterparty to redeem it...")

    // Wait for Alice to redeem the BTC HTLC, then extract secret
    const p2wsh = htlcBTCTaker.getP2WSH(this.accsConfig.secret.hash, this.accsConfig.timelockBTC)

    let preimageFromBlockchain: string | null = null
    const maxBlockHeight = htlcBTCTaker.getFundingTxBlockHeight()! + this.accsConfig.timelockBTC
    let currentBlockHeight = 0

    while (preimageFromBlockchain === null && currentBlockHeight < maxBlockHeight) {
      currentBlockHeight = (await htlcBTCTaker.bitcoinAPI.getLastBlock()).height

      htlcBTCTaker.bitcoinAPI
        .getPreimageFromLastTransaction(p2wsh.address!)
        .then((preimage) => (preimageFromBlockchain = preimage))

      await new Promise((resolve) => setTimeout(resolve, 10_000))
    }

    if (preimageFromBlockchain === null) {
      throw new Error("HTLC was not redeemed in time by the counterparty. Your HTLC will be automatically refunded.")
    }

    this.accsConfig.secret.preimage = preimageFromBlockchain

    console.log(
      `Your Bitcoin HTLC was redeemed by the counterparty using the secret "${this.accsConfig.secret.preimage}". Redeeming the Bitshares HTLC...`,
    )

    // Redeem BTS HTLC with secret

    const success = await htlcBTSTaker.redeem(
      this.accsConfig.amountBTSMini,
      this.accsConfig.privateKeyBTS,
      this.accsConfig.secret,
    )

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
    this.accsConfig.timelockBTS = Math.round(this.accsConfig.timelockBTS / 2)
    // Look for BTC HTLC and only continue if there is one
    // Use p2wsh address and fetch txs
    const htlcBTCTaker = new BitcoinHTLC(
      this.networkName,
      this.accsConfig.keyPairCounterpartyCompressedBTC,
      this.accsConfig.keyPairCompressedBTC,
      BlockStream,
    )

    let timeToWait = 120 / 2 // We only check API every 2 seconds

    console.log(
      `Looking for an HTLC for you on Bitcoin ${this.networkName}. This can take up to ${timeToWait / 60} min.`,
    )

    const p2wsh = htlcBTCTaker.getP2WSH(this.accsConfig.secret.hash, this.accsConfig.timelockBTC)
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
    const htlcBTSTaker = new BitsharesHTLC(
      this.endpointBTS,
      this.accsConfig.accountBTS,
      this.accsConfig.accountCounterpartyBTS,
    )

    await htlcBTSTaker.create({
      amount: this.accsConfig.amountBTSMini,
      asset: this.asset,
      time: this.accsConfig.timelockBTS,
      hash: this.accsConfig.secret.hash,
      privateKey: this.accsConfig.privateKeyBTS,
    })

    console.log("HTLC successfully created on Bitshares. Waiting for counterparty to redeem it...")

    // Wait for Alice to redeem the BTS HTLC, then extract secret
    timeToWait = this.accsConfig.timelockBTS
    const [accountBTSObj, accountCounterpartyBTSObj] = await btsWebsocketApi.db.get_accounts([
      this.accsConfig.accountBTS,
      this.accsConfig.accountCounterpartyBTS,
    ])
    let htlc = []

    while (htlc.length < 1) {
      if (timeToWait === 0) {
        throw new Error("HTLC was not redeemed in time by the counterparty. Your HTLC will be automatically refunded.")
      }

      const history = await btsWebsocketApi.history.get_relative_account_history(this.accsConfig.accountBTS, 0, 100, 0)

      /* eslint-disable @typescript-eslint/no-explicit-any */
      htlc = history.filter((element: any) => {
        return (
          "preimage" in element.op[1] &&
          element.op[1].from === accountBTSObj.id &&
          element.op[1].to === accountCounterpartyBTSObj.id &&
          "htlc_preimage_hash" in element.op[1] &&
          element.op[1].htlc_preimage_hash[1] === this.accsConfig.secret.hash.toString("hex")
        )
      })
      /* eslint-enable @typescript-eslint/camelcase */

      // Wait three secondes, then try again
      await new Promise((resolve) => setTimeout(resolve, 1_000))

      timeToWait--
    }

    this.accsConfig.secret.preimage = Buffer.from(htlc[0].op[1].preimage, "hex").toString()

    console.log(
      `Your Bitshares HTLC was redeemed by the counterparty using the secret "${this.accsConfig.secret.preimage}". Redeeming the Bitcoin HTLC...`,
    )

    // Redeem BTC HTLC
    const status = await htlcBTCTaker.redeem(p2wsh, this.accsConfig.secret)

    if (status === 1) {
      throw new Error("Could not redeem Bitcoin HTLC. Please try manually.")
    }
  }

  /**
   * Calls respective swap method.
   *
   * @memberof ACCS
   */
  public async run(): Promise<void> {
    if (this.accsConfig.txType === "1" && this.accsConfig.txMode === "proposer") {
      await this.proposeBTSForBTC()
    } else if (this.accsConfig.txType === "2" && this.accsConfig.txMode === "proposer") {
      await this.proposeBTCForBTS()
    } else if (this.accsConfig.txType === "1" && this.accsConfig.txMode === "taker") {
      await this.takeBTSForBTC()
    } else if (this.accsConfig.txType === "2" && this.accsConfig.txMode === "taker") {
      await this.takeBTCForBTS()
    }
  }

  /**
   * Entrypoint for CLI.
   *
   * @memberof ACCS
   */
  public async main(): Promise<void> {
    this.accsConfig = await this.getUserInput()
    await this.run()
  }
}
