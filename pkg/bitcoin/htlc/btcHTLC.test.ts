import BitcoinHTLC from "./btcHTLC"
import * as bitcoin from "bitcoinjs-lib"
import { mocked } from "ts-jest/utils"
import BlockStream from "../api/blockstream"
jest.mock("axios")
jest.mock("../api/blockstream")

jest.setTimeout(10000)
const alice = bitcoin.ECPair.fromWIF("cU3CS1SGfFQ5FvCHTWyo7JEBjWWEAcqMM84JJwGnQg9Deugj8Skw", bitcoin.networks.testnet)
const bob = bitcoin.ECPair.fromWIF("cNaEjitvA19JZxWAFyCFMsm16TvGEmVAW3AkPnVr8E9vgwdZWMGV", bitcoin.networks.testnet)
const bobCompressed = bitcoin.ECPair.fromPrivateKey(bob.privateKey!, { compressed: true })
const aliceCompressed = bitcoin.ECPair.fromPrivateKey(alice.privateKey!, { compressed: true })

const getBlockstreamMock = () => {
  return {
    getLastBlock: jest
      .spyOn(BlockStream.prototype, "getLastBlock")
      .mockResolvedValue({ height: 1000, timestamp: 5000 }), // TODO: change the values
    getTimestampAtHeight: jest.spyOn(BlockStream.prototype, "getTimestampAtHeight").mockResolvedValue(6000),
    pushTX: jest
      .spyOn(BlockStream.prototype, "pushTX")
      .mockResolvedValue("4a2d7af13070119a0b8a36082df0a03c17e60059250598b100260b0a6949a9ee"),
    getPreimageFromLastTransactioin: jest
      .spyOn(BlockStream.prototype, "getPreimageFromLastTransaction")
      .mockResolvedValue("amos"),
    getValueFromLastTransaction: jest
      .spyOn(BlockStream.prototype, "getValueFromLastTransaction")
      .mockResolvedValue({ value: 2, txID: "txID" }),
    getOutput: jest.spyOn(BlockStream.prototype, "getOutput").mockResolvedValue({ vout: 1, value: 1_000_000 }),
    getBlockHeight: jest.spyOn(BlockStream.prototype, "getBlockHeight").mockResolvedValue(1_000_000),
  }
}

const secret = {
  preimage: "TOPSECRET",
  hash: bitcoin.crypto.sha256(Buffer.from("TOPSECRET")),
}
beforeEach(() => {
  jest.resetAllMocks()

  mocked(bitcoin.payments)
  mocked(bitcoin.Psbt)

  bitcoin.Psbt.prototype.signInput = jest.fn().mockReturnValue(bitcoin.Psbt.prototype)
  bitcoin.Psbt.prototype.validateSignaturesOfInput = jest.fn().mockReturnValue(bitcoin.Psbt.prototype)
  bitcoin.Psbt.prototype.finalizeInput = jest.fn().mockReturnValue(bitcoin.Psbt.prototype)
  bitcoin.Psbt.prototype.finalizeAllInputs = jest.fn().mockReturnValue(bitcoin.Psbt.prototype)
  bitcoin.Psbt.prototype.extractTransaction = jest.fn().mockReturnValue({ toHex: () => "hex" })

  bitcoin.payments.p2wsh = jest.fn().mockReturnValue({
    network: {
      messagePrefix: "\x18Bitcoin Signed Message:\n",
      bech32: "bcrt",
      bip32: { public: 70617039, private: 70615956 },
      pubKeyHash: 111,
      scriptHash: 196,
      wif: 239,
    },
    address: "mfsqh18UT3XjpJ8yVeiM7YX1mLxq5REG9d",
    hash: Buffer.from("HASH"),
    output: Buffer.from("OUTPUT"),
    redeem: {
      output: Buffer.from(
        "6355b2756721038f0248cc0bebc425eb55af1689a59f88119c69430a860c6a05f340e445c417d7ad6821038ea27103fb646a2cea9eca9080737e0b23640caaaef2853416c9b286b353313eac",
        "hex",
      ),
    },
    input: Buffer.from("INPUT"),
    witness: [Buffer.from("WITNESS")],
    name: "NAME",
  })
})
describe("btcHTLC", () => {
  describe("create()", () => {
    // Disable logging
    // Right now we are still printing the refund hex to console
    console.log = jest.fn()


    const testCases = [
      {
        value: 2_000,
        sequence: 1,
      },
      {
        value: 1_000,
        sequence: 10,
      },
    ]
    testCases.forEach((tc) => {
      it("create method calls methods where bob redeems the HTLC", async () => {
        const blockStreamMock = getBlockstreamMock()

        const htlc = new BitcoinHTLC("testnet", aliceCompressed, bobCompressed, BlockStream)

        const htlcConfig = {
          transactionID: "4a2d7af13070119a0b8a36082df0a03c17e60059250598b100260b0a6949a9ee",
          amount: tc.value,
          sequence: tc.sequence,
          hash: secret.hash,
        }

        await htlc.create(htlcConfig)

        expect(bitcoin.payments.p2wsh).toHaveBeenCalledTimes(1)

        expect(bitcoin.Psbt.prototype.signInput).toHaveBeenCalledTimes(2)
        expect(bitcoin.Psbt.prototype.validateSignaturesOfInput).toHaveBeenCalledTimes(1)
        expect(bitcoin.Psbt.prototype.finalizeInput).toHaveBeenCalledTimes(1)
        expect(bitcoin.Psbt.prototype.finalizeAllInputs).toHaveBeenCalledTimes(1)
        expect(bitcoin.Psbt.prototype.extractTransaction).toHaveBeenCalledTimes(2)
        expect(blockStreamMock.pushTX).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe("redeem()", () => {
    it("calls methods to redeem the HTLC", async () => {
      bitcoin.Psbt.prototype.addInput = jest.fn().mockReturnValue(bitcoin.Psbt.prototype)
      bitcoin.Psbt.prototype.addOutput = jest.fn().mockReturnValue(bitcoin.Psbt.prototype)

      const blockStreamMock = getBlockstreamMock()

      const htlc = new BitcoinHTLC("testnet", aliceCompressed, bobCompressed, BlockStream)

      const p2wsh = htlc.getP2WSH(secret.hash, 1)

      const res = await htlc.redeem(p2wsh, secret)

      expect(res).toBe(0)
      expect(bitcoin.payments.p2wsh).toHaveBeenCalledTimes(1)

      expect(bitcoin.Psbt.prototype.signInput).toHaveBeenCalledTimes(1)
      expect(bitcoin.Psbt.prototype.finalizeInput).toHaveBeenCalledTimes(1)
      expect(bitcoin.Psbt.prototype.extractTransaction).toHaveBeenCalledTimes(1)
      expect(blockStreamMock.pushTX).toHaveBeenCalledTimes(1)
    })
  })
})
