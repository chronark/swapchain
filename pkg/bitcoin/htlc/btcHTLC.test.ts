import BitcoinHTLC from "./btcHTLC"
import * as bitcoin from "bitcoinjs-lib"
import { mocked } from "ts-jest/utils"

import dotenv from "dotenv"
import BlockStream from "../api/blockstream"
// eslint-disable-next-line @typescript-eslint/no-var-requires
jest.mock("node-fetch", () => require("fetch-mock-jest").sandbox())
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetchMock = require("node-fetch")
dotenv.config()

jest.setTimeout(10000)
const alice = bitcoin.ECPair.fromWIF("cU3CS1SGfFQ5FvCHTWyo7JEBjWWEAcqMM84JJwGnQg9Deugj8Skw", bitcoin.networks.testnet)
const bob = bitcoin.ECPair.fromWIF("cNaEjitvA19JZxWAFyCFMsm16TvGEmVAW3AkPnVr8E9vgwdZWMGV", bitcoin.networks.testnet)
const bobCompressed = bitcoin.ECPair.fromPrivateKey(bob.privateKey!, { compressed: true })
const aliceCompressed = bitcoin.ECPair.fromPrivateKey(alice.privateKey!, { compressed: true })

const secret = {
  preimage: "TOPSECRET",
  hash: bitcoin.crypto.sha256(Buffer.from("TOPSECRET")),
}

const toHex = jest.fn()

beforeEach(() => {
  jest.resetAllMocks()
  fetchMock.mockClear()
  


  mocked(bitcoin.payments)
  mocked(bitcoin.Psbt)

  bitcoin.Psbt.prototype.signInput = jest
    .fn()
    .mockReturnValue(bitcoin.Psbt.prototype)
  bitcoin.Psbt.prototype.validateSignaturesOfInput = jest
    .fn()
    .mockReturnValue(bitcoin.Psbt.prototype)
  bitcoin.Psbt.prototype.finalizeInput = jest
    .fn()
    .mockReturnValue(bitcoin.Psbt.prototype)
  bitcoin.Psbt.prototype.finalizeAllInputs = jest.fn().mockReturnValue(bitcoin.Psbt.prototype)
  bitcoin.Psbt.prototype.extractTransaction = jest.fn().mockReturnValue({ toHex })

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

beforeAll(() => {
  fetchMock.get("begin:https://api.blockcypher.com/v1/btc/test3/txs/", {
    hash: "4a2d7af13070119a0b8a36082df0a03c17e60059250598b100260b0a6949a9ee",
    hex:
      "02000000018dce163d3412f4253fe1c0fe18b1eccd9b38c96483458822b75792131f1bbf7c000000006b483045022100912cd98bf9388bc18092ada6f1c7dbe043fd6019cc54c5c4ed77b677ac5774830220437f9a7293ab6edb89ecc41c121ae8d1dbbfcc7ed060c0fa5c1e3cb0d337158601210298afe552bd28e6f874c827d8de7291dffa29a87d8b03a1d74e4a0a14c8ca7ad9ffffffff02905f0100000000001976a91424404a3db4a9cf9832cd06c89d089908b8b8e23d88ace80300000000000017a9144029f488d4d407b6c19a15d97bf78bcac8a8142a8700000000",
    outputs: [
      {
        value: 100_000,
        script: "76a91424404a3db4a9cf9832cd06c89d089908b8b8e23d88ac",
        addresses: ["tb1qy3qy50d5488esvkdqmyf6zyepzut3c3ap748sk"],
        /* eslint-disable-next-line @typescript-eslint/camelcase */
        script_type: "pay-to-pubkey-hash",
      },
      {
        value: 1_000,
        script: "76a91403f338e0f898ef40f1eb6734dc1f5aa72a4161f888ac",
        addresses: ["mfsqh18UT3XjpJ8yVeiM7YX1mLxq5REG9d"],
        /* eslint-disable-next-line @typescript-eslint/camelcase */
        script_type: "pay-to-pubkey-hash",
      },
    ],
  })

  fetchMock.post(
    "https://testnet-api.smartbit.com.au/v1/blockchain/pushtx",
    {
      success: true,
      txid: "4a2d7af13070119a0b8a36082df0a03c17e60059250598b100260b0a6949a9ee",
    },
    { overwriteRoutes: true },
  )
})

const testCases = [
  {
    value: 2,
    sequence: 1,
  },
  {
    value: 1_000,
    sequence: 10,
  },
]
testCases.forEach((tc) => {
  it("create method calls methods where bob redeems the HTLC", async () => {
    fetchMock.post(
      "http://localhost:13000",
      {
        success: true,
        message: "Successfully added transaction hex to database",
      },
      { overwriteRoutes: true },
    )

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
    expect(toHex).toHaveBeenCalledTimes(2)

    expect(fetchMock).toHaveReturnedTimes(6)
  })
})
