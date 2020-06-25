import Blockstream from "./blockstream"

import axios from "axios"
import { stringify } from "querystring"
jest.mock("axios")

beforeEach(() => {
  jest.resetAllMocks()
})

// TODO: cross test with mainnet
const blockstream = new Blockstream("")

describe("getLastBlock()", () => {
  it("should return height and timestamp of the last block on the blockchain", async () => {
    const hash = "HASH"

    const mockedAxios = jest
      .spyOn(axios, "get")
      .mockImplementationOnce(() => Promise.resolve(hash))
      .mockImplementationOnce(() => Promise.resolve({ data: { height: 9000, timestamp: 9001 } }))

    const result = await blockstream.getLastBlock()

    expect(result).toEqual({ height: 9000, timestamp: 9001 })
    expect(mockedAxios).toHaveBeenCalledTimes(2)
    expect(mockedAxios).toHaveBeenCalledWith("https://blockstream.info/api/blocks/tip/hash")
    expect(mockedAxios).toHaveBeenCalledWith("https://blockstream.info/api/block/" + hash)
  })
})

describe("getTimestampAtHeight()", () => {
  it("should return the timestamp of the requested block on the blockchain", async () => {
    const height = 9001
    const hash = "HASH"

    const mockedAxios = jest
      .spyOn(axios, "get")
      .mockImplementationOnce(() => Promise.resolve(hash))
      .mockImplementationOnce(() => Promise.resolve({ data: { timestamp: 1234567890 } }))

    const result = await blockstream.getTimestampAtHeight(height)

    expect(result).toBe(1234567890)
    expect(mockedAxios).toHaveBeenCalledTimes(2)
    expect(mockedAxios).toHaveBeenCalledWith("https://blockstream.info/api/block-height/" + height)
    expect(mockedAxios).toHaveBeenCalledWith("https://blockstream.info/api/block/" + hash)
  })
})
describe("pushTX()", () => {
  it("should make post request to blockstream and return the transactionID", async () => {
    const transactionHex = "transactionHex"
    const transactionID = "transactionID"

    const mockedAxios = jest
      .spyOn(axios, "post")
      .mockImplementationOnce(() => Promise.resolve({ status: 200, data: transactionID }))

    const result = await blockstream.pushTX(transactionHex)

    expect(result).toBe(transactionID)
    expect(mockedAxios).toHaveBeenCalledTimes(1)
    expect(mockedAxios).toHaveBeenCalledWith("https://blockstream.info/api/tx", transactionHex, {
      headers: {
        "Content-Type": "text/plain",
      },
    })
  })

  it("should make post request to blockstream and return an error if the hex is invalid", async () => {
    const transactionHex = "invalidHex"

    const mockedAxios = jest.spyOn(axios, "post").mockImplementationOnce(() => Promise.resolve({ status: 400 }))

    await expect(blockstream.pushTX(transactionHex)).rejects.toThrow()

    expect(mockedAxios).toHaveBeenCalledTimes(1)
    expect(mockedAxios).toHaveBeenCalledWith("https://blockstream.info/api/tx", transactionHex, {
      headers: {
        "Content-Type": "text/plain",
      },
    })
  })
})

describe("getAmountFromLastTransaction()", () => {
  const address = "ADDRESS"

  /* eslint-disable @typescript-eslint/camelcase */
  const testCases = [
    {
      name: "output from a single transaction",
      data: {
        txid: "outTXID2",
        scriptpubkey_address: address,
        value: 111111111,
      },
      out: true,
      want: { amount: 111111111, txID: "outTXID2" },
    },
    {
      name: "output from multiple transactions",
      data: {
        vout: [
          {
            txid: "outTXID",
            scriptpubkey_address: "outSCRIPTPUBKEY_ADDRESS",
            value: 1e10,
          },
          {
            txid: "outTXID2",
            scriptpubkey_address: address,
            value: 111111111,
          },
        ],
      },
      out: true,
      want: { amount: 111111111, txID: "outTXID2" },
    },
    {
      name: "input from a single transaction",
      data: {
        vin: [
          {
            txid: "inTXID",
            prevout: {
              scriptpubkey_address: address,
              value: 5,
            },
          },
        ],
      },
      out: false,
      want: { amount: 5, txID: "inTXID" },
    },
    {
      name: "input from multiple transactions",
      data: {
        vin: [
          {
            txid: "inTXID",
            prevout: {
              scriptpubkey_address: address,
              value: 5,
            },
          },
          {
            txid: "inTXID2",
            prevout: {
              scriptpubkey_address: "OTHER ADDRESS",
              value: 55,
            },
          },
        ],
      },
      out: false,
      want: { amount: 5, txID: "inTXID" },
    },
     {
      name: "input from multiple transactions",
      data: {
        vin: [
          {
            txid: "inTXID",
            prevout: {
              scriptpubkey_address: address,
              value: 5,
            },
          },
          {
            txid: "inTXID2",
            prevout: {
              scriptpubkey_address: "OTHER ADDRESS",
              value: 55,
            },
          },
        ],
      },
      out: false,
      want: { amount: 5, txID: "inTXID" },
    },
  ]
  /* eslint-enable @typescript-eslint/camelcase */

  testCases.forEach((tc) => {
    it(`should return amount and transactionID from an address ${tc.name}`, async () => {
      const mockedAxios = jest.spyOn(axios, "get").mockImplementationOnce(() => Promise.resolve({ data: tc.data }))
      const result = await blockstream.getAmountFromLastTransaction(address, tc.out)

      expect(result).toEqual(tc.want)
      expect(mockedAxios).toHaveBeenCalledTimes(1)
      expect(mockedAxios).toHaveBeenCalledWith(`https://blockstream.info/api/address/${address}/txs`)
    })
  })

  it("should throw an error if the API does not return a status 200", async () => {
    const mockedAxios = jest.spyOn(axios, "get").mockImplementation(() => Promise.resolve({ status: 400, data: "error message" }))
    await expect(blockstream.getAmountFromLastTransaction("ADDRESS1", true)).rejects.toThrow()
    await expect(blockstream.getAmountFromLastTransaction("ADDRESS2", false)).rejects.toThrow()
  })
})

