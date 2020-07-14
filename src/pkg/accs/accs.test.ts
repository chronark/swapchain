import ACCS, { ACCSConfig, ACCSFields } from "./accs"
import * as bitcoin from "bitcoinjs-lib"
import { mocked } from "ts-jest/utils"
import { Timer } from "./timer"
import { BitsharesAPI } from "../bitshares/api/api"

jest.mock("../bitshares/api/api")
console.log = jest.fn()

beforeEach(() => {
  jest.resetAllMocks()
})

describe("parseUserInput()", () => {
  it.skip("parses the raw user input correctly and returns an ACCS config for BTC testnet", async () => {
    const preimage = "TOPSECRETTOPSECRETTOPSECRETTOPSE"
    const secretObject = {
      preimage,
      hash: bitcoin.crypto.sha256(Buffer.from(preimage)),
    }
    jest.spyOn(BitsharesAPI.prototype, "getAccountID").mockResolvedValue("some value")
    jest.spyOn(Timer.prototype, "toBTS").mockResolvedValue(3600)

    const fields: ACCSFields = {
      mode: "proposer",
      networkToTrade: "testnet",
      currencyToGive: "BTC",
      amountToSend: 0.001,
      rate: 200000,
      amountToReceive: 200,
      priority: 0,
      bitcoinPrivateKey: "cVPwsbE8HNMCoLGz8N4R2SfyQTMQzznL9x3vEHJqPtuZ1rhBkTo7",
      bitsharesPrivateKey: "5Z89Ve18ttnu7Ymd1nnCMsnGkfKk4KQnsfFrYEz7Cmw39FAMOSS",
      counterpartyBitcoinPublicKey: "034c7ddacc16fa5e53aa5dc19748e3877ba07b981fdbbcdb97b8b19de240241f61",
      counterpartyBitsharesAccountName: "testBTSCounterpartyAccount",
      secret: secretObject,
      bitcoinTxID: "testBTCTxID",
    }

    const expectedConfig: ACCSConfig = {
      mode: "proposer",
      networkName: "testnet",
      network: bitcoin.networks.testnet,
      type: "BTC",
      priority: 0,
      bitsharesAccountID: "testAccount",
      bitsharesPrivateKey: "5Z89Ve18ttnu7Ymd1nnCMsnGkfKk4KQnsfFrYEz7Cmw39FAMOSS",
      keyPairCompressedBTC: bitcoin.ECPair.fromPrivateKey(
        bitcoin.ECPair.fromWIF("cVPwsbE8HNMCoLGz8N4R2SfyQTMQzznL9x3vEHJqPtuZ1rhBkTo7", bitcoin.networks.testnet)
          .privateKey!,
        { compressed: true },
      ),
      counterpartyKeyPairCompressedBTC: bitcoin.ECPair.fromPublicKey(
        Buffer.from("034c7ddacc16fa5e53aa5dc19748e3877ba07b981fdbbcdb97b8b19de240241f61", "hex"),
        {
          compressed: true,
        },
      ),
      counterpartyBitsharesAccountID: "testBTSCounterpartyAccount",
      timelockBTC: 6,
      timelockBTS: 3600,
      amountBTSMini: 20000000,
      amountSatoshi: 100000,
      secret: secretObject,
      bitcoinTxID: "testBTCTxID",
      bitsharesAsset: "TEST",
      bitsharesEndpoint: "wss://testnet.dex.trading/",
      checkAPIInterval: 4,
    }

    const config = await ACCS.parseUserInput(fields)

    expect(config.mode).toBe(expectedConfig.mode)
    expect(config.networkName).toBe(expectedConfig.networkName)
    expect(config.bitsharesPrivateKey).toBe(expectedConfig.bitsharesPrivateKey)
    expect(JSON.stringify(config.network)).toBe(JSON.stringify(expectedConfig.network))
    expect(JSON.stringify(config.keyPairCompressedBTC)).toBe(JSON.stringify(expectedConfig.keyPairCompressedBTC))
    expect(JSON.stringify(config.counterpartyKeyPairCompressedBTC)).toBe(
      JSON.stringify(expectedConfig.counterpartyKeyPairCompressedBTC),
    )
    expect(config.amountBTSMini).toBe(expectedConfig.amountBTSMini)
    expect(config.amountSatoshi).toBe(expectedConfig.amountSatoshi)
    expect(config.timelockBTC).toBe(expectedConfig.timelockBTC)
    expect(config.timelockBTS).toBe(expectedConfig.timelockBTS)
    expect(config.bitsharesEndpoint).toBe(expectedConfig.bitsharesEndpoint)
  })

  it.skip("parses the raw user input correctly and returns an ACCS config for BTS mainnet", async () => {
    jest.spyOn(BitsharesAPI.prototype, "getAccountID").mockResolvedValue("some value")

    const preimage = "TOPSECRETTOPSECRETTOPSECRETTOPSE"
    const secretObject = {
      preimage,
      hash: bitcoin.crypto.sha256(Buffer.from(preimage)),
    }
    jest.spyOn(Timer.prototype, "toBTS").mockResolvedValue(3600)

    const fields: ACCSFields = {
      mode: "proposer",
      networkToTrade: "mainnet",
      currencyToGive: "BTS",
      amountToSend: 200,
      rate: 200000,
      amountToReceive: 0.001,
      priority: 0,
      bitcoinPrivateKey: "L2kFjyRuJ3gEUwgw7JGRP72b4Fmgcw7kXX793BKNCXJvDfNHebRC",
      bitsharesPrivateKey: "5Z89Ve18ttnu7Ymd1nnCMsnGkfKk4KQnsfFrYEz7Cmw39FAMOSS",
      counterpartyBitcoinPublicKey: "034c7ddacc16fa5e53aa5dc19748e3877ba07b981fdbbcdb97b8b19de240241f61",
      counterpartyBitsharesAccountName: "testBTSCounterpartyAccount",
      secret: secretObject,
      bitcoinTxID: "testBTCTxID",
    }

    const expectedConfig: ACCSConfig = {
      mode: "proposer",
      networkName: "mainnet",
      network: bitcoin.networks.bitcoin,
      type: "BTS",
      priority: 0,
      bitsharesAccountID: "testAccount",
      bitsharesPrivateKey: "5Z89Ve18ttnu7Ymd1nnCMsnGkfKk4KQnsfFrYEz7Cmw39FAMOSS",
      keyPairCompressedBTC: bitcoin.ECPair.fromPrivateKey(
        bitcoin.ECPair.fromWIF("L2kFjyRuJ3gEUwgw7JGRP72b4Fmgcw7kXX793BKNCXJvDfNHebRC", bitcoin.networks.bitcoin)
          .privateKey!,
        { compressed: true },
      ),
      counterpartyKeyPairCompressedBTC: bitcoin.ECPair.fromPublicKey(
        Buffer.from("034c7ddacc16fa5e53aa5dc19748e3877ba07b981fdbbcdb97b8b19de240241f61", "hex"),
        {
          compressed: true,
        },
      ),
      counterpartyBitsharesAccountID: "testBTSCounterpartyAccount",
      timelockBTC: 6,
      timelockBTS: 3600,
      amountBTSMini: 20000000,
      amountSatoshi: 100000,
      secret: secretObject,
      bitcoinTxID: "testBTCTxID",
      bitsharesAsset: "BTS",
      bitsharesEndpoint: "wss://api.dex.trading/",
      checkAPIInterval: 4,
    }

    const config = await ACCS.parseUserInput(fields)

    expect(config.mode).toBe(expectedConfig.mode)
    expect(config.networkName).toBe(expectedConfig.networkName)
    expect(config.bitsharesPrivateKey).toBe(expectedConfig.bitsharesPrivateKey)
    expect(JSON.stringify(config.network)).toBe(JSON.stringify(expectedConfig.network))
    expect(JSON.stringify(config.keyPairCompressedBTC)).toBe(JSON.stringify(expectedConfig.keyPairCompressedBTC))
    expect(JSON.stringify(config.counterpartyKeyPairCompressedBTC)).toBe(
      JSON.stringify(expectedConfig.counterpartyKeyPairCompressedBTC),
    )
    expect(config.amountBTSMini).toBe(expectedConfig.amountBTSMini)
    expect(config.amountSatoshi).toBe(expectedConfig.amountSatoshi)
    expect(config.timelockBTC).toBe(expectedConfig.timelockBTC)
    expect(config.timelockBTS).toBe(expectedConfig.timelockBTS)
    expect(config.bitsharesEndpoint).toBe(expectedConfig.bitsharesEndpoint)
  })
})

describe("run()", () => {
  const preimage = "TOPSECRETTOPSECRETTOPSECRETTOPSE"
  const secretObject = {
    preimage,
    hash: bitcoin.crypto.sha256(Buffer.from(preimage)),
  }

  const fields: ACCSFields = {
    mode: "proposer",
    networkToTrade: "mainnet",
    currencyToGive: "BTS",
    amountToSend: 200,
    rate: 200000,
    amountToReceive: 0.001,
    priority: 0,
    bitcoinPrivateKey: "L2kFjyRuJ3gEUwgw7JGRP72b4Fmgcw7kXX793BKNCXJvDfNHebRC",
    bitsharesPrivateKey: "5Z89Ve18ttnu7Ymd1nnCMsnGkfKk4KQnsfFrYEz7Cmw39FAMOSS",
    counterpartyBitcoinPublicKey: "034c7ddacc16fa5e53aa5dc19748e3877ba07b981fdbbcdb97b8b19de240241f61",
    counterpartyBitsharesAccountName: "testBTSCounterpartyAccount",
    secret: secretObject,
    bitcoinTxID: "testBTCTxID",
  }

  const config = {
    networkName: "mainnet",
    network: bitcoin.networks.bitcoin,
    priority: 0,
    bitsharesAccountID: "testAccount",
    bitsharesPrivateKey: "5Z89Ve18ttnu7Ymd1nnCMsnGkfKk4KQnsfFrYEz7Cmw39FAMOSS",
    keyPairCompressedBTC: bitcoin.ECPair.fromPrivateKey(
      bitcoin.ECPair.fromWIF("L2kFjyRuJ3gEUwgw7JGRP72b4Fmgcw7kXX793BKNCXJvDfNHebRC", bitcoin.networks.bitcoin)
        .privateKey!,
      { compressed: true },
    ),
    counterpartyKeyPairCompressedBTC: bitcoin.ECPair.fromPublicKey(
      Buffer.from("034c7ddacc16fa5e53aa5dc19748e3877ba07b981fdbbcdb97b8b19de240241f61", "hex"),
      {
        compressed: true,
      },
    ),
    counterpartyBitsharesAccountID: "testBTSCounterpartyAccount",
    timelockBTC: 6,
    timelockBTS: 3600,
    amountBTSMini: 20000000,
    amountSatoshi: 100000,
    secret: secretObject,
    bitcoinTxID: "testBTCTxID",
    bitsharesAsset: "BTS",
    bitsharesEndpoint: "wss://api.dex.trading/",
    checkAPIInterval: 4,
  }

  it.skip("calls parseUserInput and proposeBTSForBTC", async () => {
    const caseConfig = {
      type: "BTC",
      mode: "proposer",
      ...config,
    }
    const mockParseUserInput = jest.spyOn(ACCS, "parseUserInput").mockImplementation(
      async (fields: ACCSFields): Promise<ACCSConfig> => {
        return caseConfig
      },
    )
    const mockProposeBTSForBTC = jest.spyOn(ACCS, "proposeBTSForBTC").mockImplementation(() => Promise.resolve())

    await ACCS.run(fields)
    expect(mockParseUserInput).toHaveBeenCalledTimes(1)
    expect(mockProposeBTSForBTC).toHaveBeenCalledTimes(1)
  })
  it.skip("calls parseUserInput and proposeBTCForBTS", async () => {
    const caseConfig = {
      type: "BTS",
      mode: "proposer",
      ...config,
    }
    const mockParseUserInput = jest.spyOn(ACCS, "parseUserInput").mockImplementation(
      async (fields: ACCSFields): Promise<ACCSConfig> => {
        return caseConfig
      },
    )
    const mockProposeBTCForBTS = jest.spyOn(ACCS, "proposeBTCForBTS").mockImplementation(() => Promise.resolve())

    await ACCS.run(fields)
    expect(mockParseUserInput).toHaveBeenCalledTimes(1)
    expect(mockProposeBTCForBTS).toHaveBeenCalledTimes(1)
  })
  it.skip("calls parseUserInput and takeBTSForBTC", async () => {
    const caseConfig = {
      type: "BTC",
      mode: "accepter",
      ...config,
    }
    const mockParseUserInput = jest.spyOn(ACCS, "parseUserInput").mockImplementation(
      async (fields: ACCSFields): Promise<ACCSConfig> => {
        return caseConfig
      },
    )
    const mockTakeBTSForBTC = jest.spyOn(ACCS, "takeBTSForBTC").mockImplementation(() => Promise.resolve())

    await ACCS.run(fields)
    expect(mockParseUserInput).toHaveBeenCalledTimes(1)
    expect(mockTakeBTSForBTC).toHaveBeenCalledTimes(1)
  })
  it.skip("calls parseUserInput and takeBTCForBTS", async () => {
    const caseConfig = {
      type: "BTS",
      mode: "accepter",
      ...config,
    }
    const mockParseUserInput = jest.spyOn(ACCS, "parseUserInput").mockImplementation(
      async (fields: ACCSFields): Promise<ACCSConfig> => {
        return caseConfig
      },
    )
    const mockTakeBTCForBTS = jest.spyOn(ACCS, "takeBTCForBTS").mockImplementation(() => Promise.resolve())

    await ACCS.run(fields)
    expect(mockParseUserInput).toHaveBeenCalledTimes(1)
    expect(mockTakeBTCForBTS).toHaveBeenCalledTimes(1)
  })
})
