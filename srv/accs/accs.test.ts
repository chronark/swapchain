import ACCS, { ACCSConfig } from "./accs"
import * as bitcoin from "bitcoinjs-lib"
import { mocked } from "ts-jest/utils"
import { getSecret, Secret } from "../../pkg/secret/secret"
import BitcoinHTLC from "../../pkg/bitcoin/htlc/btcHTLC"
import BitsharesHTLC from "../../pkg/bitshares/htlc/btsHTLC"
import BlockStream from "../../pkg/bitcoin/api/blockstream"
jest.mock("../../pkg/secret/secret")
jest.mock("../../pkg/bitshares/htlc/btsHTLC")
jest.mock("../../pkg/bitcoin/htlc/btcHTLC")
jest.mock("../../pkg/bitcoin/api/blockstream")
console.log = jest.fn()

const getBitcoinHTLCMock = () => {
  return {
    redeem: jest.spyOn(BitcoinHTLC.prototype, "redeem").mockImplementation(() => Promise.resolve()),
    create: jest.spyOn(BitcoinHTLC.prototype, "create").mockImplementation(() => Promise.resolve()),
    getFundingTxBlockHeight: jest.spyOn(BitcoinHTLC.prototype, "getFundingTxBlockHeight").mockReturnValue(1000),
    bitcoinAPI: {
      getLastBlock: jest
        .spyOn(BlockStream.prototype, "getLastBlock")
        .mockResolvedValue({ height: 2000, timestamp: 1_000_000 }),
    },
  }
}

const getBitsharesHTLCMock = () => {
  return {
    redeem: jest.spyOn(BitsharesHTLC.prototype, "redeem").mockResolvedValue(true),
    create: jest.spyOn(BitsharesHTLC.prototype, "create").mockResolvedValue(true),
  }
}

describe("getUserInput()", () => {
  it("it returns user input as ACCS config object correctly", async () => {
    const preimage = "TOPSECRETTOPSECRETTOPSECRETTOPSE"
    const secretObject = {
      preimage,
      hash: bitcoin.crypto.sha256(Buffer.from(preimage)),
    }
    jest
      .spyOn(ACCS.prototype, "askUser")
      .mockReturnValueOnce(Promise.resolve("Proposer"))
      .mockReturnValueOnce(Promise.resolve("1"))
      .mockReturnValueOnce(Promise.resolve("0"))
      .mockReturnValueOnce(Promise.resolve("testBTSAccount"))
      .mockReturnValueOnce(Promise.resolve("testBTSPrivateKey"))
      .mockReturnValueOnce(Promise.resolve("cTZs9RHsw3nDt98nDNSw3BDs53yaWmQkDFaF8MtBWEMkPMrg42t5"))
      .mockReturnValueOnce(Promise.resolve("testBTSCounterpartyAccount"))
      .mockReturnValueOnce(Promise.resolve("03c11fe663a2e72b2c0a67d23235d5320d6d7efede7c99f1322b05665e15d129ed"))
      .mockReturnValueOnce(Promise.resolve("0.001"))
      .mockReturnValueOnce(Promise.resolve("testBTCTxID"))
    mocked(getSecret).mockImplementation(
      (): Secret => {
        return secretObject
      },
    )

    const expectedACCSConfig: ACCSConfig = {
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
      speedBTC: 500,
      timelockBTC: 6,
      timelockBTS: 3000,
      secret: secretObject,
      txIdBTC: "testBTCTxID",
    }
    const accs = new ACCS("testnet")

    const accsConfig = await accs.getUserInput()

    expect(accsConfig.txMode).toBe(expectedACCSConfig.txMode)
  })

})
describe("proposeBTSForBTC()", async () => {
  it("runs... TODO:", async () => {
    const accsConfig: ACCSConfig = {
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
      speedBTC: 500,
      timelockBTC: 6,
      timelockBTS: 3000,
      secret: {
        preimage: "TOPSECRETTOPSECRETTOPSECRETTOPSE",
        hash: bitcoin.crypto.sha256(Buffer.from("TOPSECRETTOPSECRETTOPSECRETTOPSE")),
      },
      txIdBTC: "testBTCTxID",
    }
    const BitcoinHTLCMock = getBitcoinHTLCMock()
    const BitsharesHTLCMock = getBitsharesHTLCMock()

    const accs = new ACCS("mainnet")
    accs.setConfig(accsConfig)
    await accs.proposeBTSForBTC()

    expect(BitcoinHTLCMock.create).toHaveBeenCalledTimes(1)
    expect(BitcoinHTLCMock.redeem).toHaveBeenCalledTimes(1)
  })
})
