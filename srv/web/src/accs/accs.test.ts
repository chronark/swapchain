import ACCS, { ACCSConfig } from "./accs"
import readline from "readline"
import * as bitcoin from "bitcoinjs-lib"
import { mocked } from "ts-jest/utils"
import { Timer } from "./timer"
import { getAccount } from "../pkg/bitshares/util"
jest.mock("../pkg/bitshares/util")
console.log = jest.fn()

describe("parseUserInput()", () => {})

describe("run()", () => {
  const defaultConfig = {
    txTypeName: "BTS/BTC",
    priority: 0,
    accountBTS: "testBTSAccount",
    privateKeyBTS: "testBTSPrivateKey",
    accountCounterpartyBTS: "testBTSCounterpartyAccount",
    amount: "0.001",
    rateBTSBTC: 500000,
    amountBTSMini: 50000000,
    amountSatoshi: 100000,
    keyPairCompressedBTC: bitcoin.ECPair.fromPrivateKey(
      bitcoin.ECPair.fromWIF("cTZs9RHsw3nDt98nDNSw3BDs53yaWmQkDFaF8MtBWEMkPMrg42t5", bitcoin.networks.testnet)
        .privateKey!,
      { compressed: true },
    ),
    keyPairCounterpartyCompressedBTC: bitcoin.ECPair.fromPublicKey(
      Buffer.from("03c11fe663a2e72b2c0a67d23235d5320d6d7efede7c99f1322b05665e15d129ed", "hex"),
      {
        compressed: true,
      },
    ),
    timelockBTC: 6,
    timelockBTS: 3000,
    secret: {
      preimage: "TOPSECRETTOPSECRETTOPSECRETTOPSE",
      hash: bitcoin.crypto.sha256(Buffer.from("TOPSECRETTOPSECRETTOPSECRETTOPSE")),
    },
    txIdBTC: "testBTCTxID",
  }

  it("calls proposeBTSForBTC", async () => {
    const accs = new ACCS("mainnet")
    accs.setConfig({
      txType: "1",
      txMode: "proposer",
      ...defaultConfig,
    })
    const mock = jest.spyOn(accs, "proposeBTSForBTC").mockImplementation(() => Promise.resolve())

    await accs.run()
    expect(mock).toHaveBeenCalledTimes(1)
  })

  it("calls proposeBTCForBTS", async () => {
    const accs = new ACCS("mainnet")
    accs.setConfig({
      txType: "2",
      txMode: "proposer",
      ...defaultConfig,
    })
    const mock = jest.spyOn(accs, "proposeBTCForBTS").mockImplementation(() => Promise.resolve())

    await accs.run()
    expect(mock).toHaveBeenCalledTimes(1)
  })

  it("calls takeBTSForBTC", async () => {
    const accs = new ACCS("mainnet")
    accs.setConfig({
      txType: "1",
      txMode: "taker",
      ...defaultConfig,
    })
    const mock = jest.spyOn(accs, "takeBTSForBTC").mockImplementation(() => Promise.resolve())

    await accs.run()
    expect(mock).toHaveBeenCalledTimes(1)
  })

  it("calls takeBTCForBTS", async () => {
    const accs = new ACCS("mainnet")
    accs.setConfig({
      txType: "2",
      txMode: "taker",
      ...defaultConfig,
    })
    const mock = jest.spyOn(accs, "takeBTCForBTS").mockImplementation(() => Promise.resolve())

    await accs.run()
    expect(mock).toHaveBeenCalledTimes(1)
  })
})

describe("main()", () => {
  it("asks for user input and runs afterwards", async () => {
    const config: ACCSConfig = {
      txMode: "proposer",
      txType: "1",
      txTypeName: "BTS/BTC",
      priority: 0,
      accountBTS: "testBTSAccount",
      privateKeyBTS: "testBTSPrivateKey",
      accountCounterpartyBTS: "testBTSCounterpartyAccount",
      amount: "0.001",
      rateBTSBTC: 500000,
      amountBTSMini: 50000000,
      amountSatoshi: 100000,
      keyPairCompressedBTC: bitcoin.ECPair.fromPrivateKey(
        bitcoin.ECPair.fromWIF("cTZs9RHsw3nDt98nDNSw3BDs53yaWmQkDFaF8MtBWEMkPMrg42t5", bitcoin.networks.testnet)
          .privateKey!,
        { compressed: true },
      ),
      keyPairCounterpartyCompressedBTC: bitcoin.ECPair.fromPublicKey(
        Buffer.from("03c11fe663a2e72b2c0a67d23235d5320d6d7efede7c99f1322b05665e15d129ed", "hex"),
        {
          compressed: true,
        },
      ),
      timelockBTC: 6,
      timelockBTS: 3000,
      secret: {
        preimage: "TOPSECRETTOPSECRETTOPSECRETTOPSE",
        hash: bitcoin.crypto.sha256(Buffer.from("TOPSECRETTOPSECRETTOPSECRETTOPSE")),
      },
      txIdBTC: "testBTCTxID",
    }

    const accs = new ACCS("testnet")
    const getUserInputMock = jest.spyOn(accs, "getUserInput").mockResolvedValue(config)
    const runMock = jest.spyOn(accs, "run").mockResolvedValue()

    await accs.main()
    expect(getUserInputMock).toHaveBeenCalledTimes(1)
    expect(runMock).toHaveBeenCalledTimes(1)
  })
})
