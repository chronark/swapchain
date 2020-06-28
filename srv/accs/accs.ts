import readline from "readline"
import { Secret, getSecret } from "../../pkg/secret/secret"
import fetch from "node-fetch"
import * as bitcoin from "bitcoinjs-lib"
import { Apis as btsWebsocketApi } from "bitsharesjs-ws"
import BitcoinHTLC, { TransactionBlockstream } from "../../pkg/bitcoin/htlc/btcHTLC"
import figlet from "figlet"
import BitsharesHTLC from "../../pkg/bitshares/htlc/btsHTLC"

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
        this.errorHandler(err.toString())
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
      this.errorHandler("Invalid mode.")
    }

    accsConfig.txType = await this.askUser("Would you like to get (1) BTS for BTC or (2) BTC for BTS? (1/2): ")
    if (accsConfig.txType !== "1" && accsConfig.txType !== "2") {
      this.errorHandler("Invalid type.")
    }
    accsConfig.txTypeName = accsConfig.txType === "1" ? "BTS/BTC" : "BTC/BTS"
    // TODO: "Manual mode or ID from order book?" -> Connection to backend

    accsConfig.accountBTS = await this.askUser("Please enter your Bitshares account name: ")

    accsConfig.privateKeyBTS = await this.askUser(
      "Please enter your private key (WIF format) associated with the given Bitshares account: ",
    )

    const privateKeyBTC = await this.askUser("Please enter your Bitcoin private key (WIF format): ")

    accsConfig.accountCounterpartyBTS = await this.askUser("Please enter the Bitshares account name of the counterparty: ")

    const publicKeyCounterpartyBTC = await this.askUser("Please enter the Bitcoin public key of the counterparty: ")
    if (!(publicKeyCounterpartyBTC.length === 66 || publicKeyCounterpartyBTC.length === 130)) {
      this.errorHandler("Invalid Bitcoin public key.")
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
    const blocks = await fetch(`${this.endpointBTC}blocks`).then((res) => res.json())
    accsConfig.speedBTC = (blocks[0].timestamp - blocks[9].timestamp) / 10

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
        this.errorHandler("Invalid secret hash length.")
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
   * Handles errors by printing messages and exiting.
   *
   * @param message - An error message to print.
   * @memberof ACCS
   */
  private errorHandler(message: string): void {
    console.log("Error: " + message + " Aborting...")
    process.exit(1)
  }

  /**
   * Handles ACCS for proposer who wants BTS for BTC.
   *
   * @memberof ACCS
   */
  public async proposeBTSForBTC(): Promise<void> {
    
    this.accsConfig.timelockBTS = Math.round(this.accsConfig.timelockBTS / 2)
    
    const htlcBTCProposer = new BitcoinHTLC(
      this.net,
      this.accsConfig.keyPairCompressedBTC,
      this.accsConfig.keyPairCounterpartyCompressedBTC,
    )

    const status = await htlcBTCProposer.create({
      transactionID: this.accsConfig.txIdBTC,
      amount: this.accsConfig.amountSatoshi,
      sequence: this.accsConfig.timelockBTC,
      hash: this.accsConfig.secret.hash,
    })

    if (status === 1) {
      this.errorHandler("The output of the transaction ID given does not have sufficient balance.")
    } else if (status === 2) {
      this.errorHandler("Pushing funding transaction failed. Is the endpoint down?")
    } else if (status === 3) {
      this.errorHandler("Posting refundHex to database failed. Please refund HTLC manually.")
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

    // If no HTLC found immediately, continue looking until timelock
    while (!success) {
      const blocks = await fetch(`${this.endpointBTC}blocks`).then((res) => res.json())
      const currentBlockHeight = blocks[0].height

      if (currentBlockHeight >= htlcBTCProposer.getFundingTxBlockHeight() + this.accsConfig.timelockBTC) {
        htlcBTSProposer.stopLooking()
        this.errorHandler(`No HTLC found on Bitshares ${this.networkName}. Your HTLC will be automatically refunded.`)
      }

      await new Promise((resolve) => setTimeout(resolve, 10_000))
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
      this.net,
      this.accsConfig.keyPairCounterpartyCompressedBTC,
      this.accsConfig.keyPairCompressedBTC,
    )

    const p2wsh = htlcBTCProposer.getP2WSH(this.accsConfig.secret.hash, this.accsConfig.timelockBTC)

    let timeToWait = this.accsConfig.timelockBTS
    let tx = {}
    htlcBTCProposer.getTransactionByAddress(p2wsh.address!, true).then((res) => (tx = res))

    while (!("txid" in tx)) {
      if (timeToWait === 0) {
        htlcBTCProposer.stopLooking()
        this.errorHandler(`No HTLC found on Bitcoin ${this.networkName}. Your HTLC will be automatically refunded.`)
      }

      await new Promise((resolve) => setTimeout(resolve, 1_000))

      timeToWait--
    }

    // redeem
    const status = await htlcBTCProposer.redeem(p2wsh, this.accsConfig.secret)

    if (status === 1) {
      this.errorHandler("Could not redeem Bitcoin HTLC. Please try manually.")
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

    let timeToWait = 120 // seconds to wait for proposer

    console.log(
      `Looking for an HTLC for you on Bitshares ${this.networkName}. This can take up to ${timeToWait / 60} min.`,
    )

    let id = ""
    htlcBTSTaker.getID(this.accsConfig.amountBTSMini, this.accsConfig.secret.hash).then((res) => (id = res))

    while (!id) {
      if (timeToWait === 0) {
        htlcBTSTaker.stopLooking()
        this.errorHandler(`No HTLC found on Bitshares ${this.networkName}. Please contact proposer.`)
      }

      await new Promise((resolve) => setTimeout(resolve, 1_000))

      timeToWait--
    }

    console.log(`Found the HTLC for you on Bitshares ${this.networkName}!`)

    const htlcBTCTaker = new BitcoinHTLC(
      this.net,
      this.accsConfig.keyPairCompressedBTC,
      this.accsConfig.keyPairCounterpartyCompressedBTC,
    )

    const status = await htlcBTCTaker.create({
      transactionID: this.accsConfig.txIdBTC,
      amount: this.accsConfig.amountSatoshi,
      sequence: this.accsConfig.timelockBTC,
      hash: this.accsConfig.secret.hash,
    })

    if (status === 1) {
      this.errorHandler("The output of the transaction ID given does not have sufficient balance.")
    } else if (status === 2) {
      this.errorHandler("Pushing funding transaction failed. Is the endpoint down?")
    } else if (status === 3) {
      this.errorHandler("Posting refundHex to database failed. Please refund HTLC manually.")
    }

    console.log("HTLC successfully created on Bitcoin. Waiting for counterparty to redeem it...")

    // Wait for Alice to redeem the BTC HTLC, then extract secret
    const p2wsh = htlcBTCTaker.getP2WSH(this.accsConfig.secret.hash, this.accsConfig.timelockBTC)

    /* eslint-disable @typescript-eslint/camelcase */
    let tx: TransactionBlockstream = {
      txid: "",
      vin: [
        {
          txid: "",
          vout: 0,
          prevout: {
            scriptpubkey_address: "",
            value: 0,
          },
          witness: [""],
        },
      ],
      vout: [
        {
          scriptpubkey_type: "",
          scriptpubkey_address: "",
          value: 0,
        },
      ],
      status: {
        block_height: 0,
      },
    }
    /* eslint-enable @typescript-eslint/camelcase */

    htlcBTCTaker.getTransactionByAddress(p2wsh.address!, false).then((res) => (tx = res))

    while (!tx.txid) {
      const blocks = await fetch(`${this.endpointBTC}blocks`).then((res) => res.json())
      const currentBlockHeight = blocks[0].height

      if (currentBlockHeight >= htlcBTCTaker.getFundingTxBlockHeight() + this.accsConfig.timelockBTC) {
        htlcBTCTaker.stopLooking()
        this.errorHandler(
          "HTLC was not redeemed in time by the counterparty. Your HTLC will be automatically refunded.",
        )
      }

      await new Promise((resolve) => setTimeout(resolve, 10_000))
    }

    this.accsConfig.secret.preimage = Buffer.from(tx.vin[0].witness[1], "hex").toString()

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
      this.errorHandler("Could not redeem Bitshares HTLC. Please try manually.")
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
      this.net,
      this.accsConfig.keyPairCounterpartyCompressedBTC,
      this.accsConfig.keyPairCompressedBTC,
    )

    let timeToWait = 120 // seconds to wait for proposer

    console.log(
      `Looking for an HTLC for you on Bitcoin ${this.networkName}. This can take up to ${timeToWait / 60} min.`,
    )

    const p2wsh = htlcBTCTaker.getP2WSH(this.accsConfig.secret.hash, this.accsConfig.timelockBTC)
    let tx = {}
    htlcBTCTaker.getTransactionByAddress(p2wsh.address!, true).then((res) => (tx = res))

    while (!("txid" in tx)) {
      if (timeToWait === 0) {
        htlcBTCTaker.stopLooking()
        this.errorHandler(`No HTLC found on Bitcoin ${this.networkName}. Please contact proposer.`)
      }

      await new Promise((resolve) => setTimeout(resolve, 1_000))

      timeToWait--
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
        this.errorHandler(
          "HTLC was not redeemed in time by the counterparty. Your HTLC will be automatically refunded.",
        )
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
      this.errorHandler("Could not redeem Bitcoin HTLC. Please try manually.")
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