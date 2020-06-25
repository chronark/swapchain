import Blockstream from "./blockstream"

import axios from "axios"
import { stringify } from "querystring"
import { isTaggedTemplateExpression } from "typescript"
jest.mock("axios")

beforeEach(() => {
  jest.resetAllMocks()
})

const blockstream = new Blockstream("")

describe('constructor()', () => {
  it("sets the api url to 'testnet'", () => {
    const blockstream = new Blockstream("testnet")
    expect(blockstream.baseURL).toBe("https://blockstream.info/testnet/api")
  })
  it("sets the api url to 'testnet'", () => {
    const blockstream = new Blockstream("anything else")
    expect(blockstream.baseURL).toBe("https://blockstream.info/api")
  })
})



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

describe("getValueFromLastTransaction()", () => {
  const address = "ADDRESS"

  /* eslint-disable @typescript-eslint/camelcase */
  const testCases = [
    {
      name: "output from a single transaction",
      transactions: [{
        txid: "outTXID2",
        vout: [{
          scriptpubkey_address: address,
          value: 111111111,
        }]
      }],
      out: true,
      want: { value: 111111111, txID: "outTXID2" },
    },
    {
      name: "output from multiple transactions",
      transactions: [{
        txid: "outTXID2",
        vout: [
          {
            scriptpubkey_address: "WRONGADDRESS",
            value: 1,
          },
          {
            scriptpubkey_address: "ANOTHERWRONGADDRESS",
            value: 2,
          },
          {
            scriptpubkey_address: address,
            value: 3,
          },
        ],
      }],
      out: true,
      want: { value: 3, txID: "outTXID2" },
    },
    {
      name: "input from a single transaction",
      transactions: [{
        txid: "inTXID",
        vin: [
          {
            prevout: {
              scriptpubkey_address: address,
              value: 5,
            },
          },
        ],
      }],
      out: false,
      want: { value: 5, txID: "inTXID" },
    },
    {
      name: "input from multiple transactions",
      transactions: [{
        txid: "inTXID",
        vin: [
          {
            prevout: {
              scriptpubkey_address: "OTHER ADDRESS",
              value: 55,
            },
          },
          {
            prevout: {
              scriptpubkey_address: address,
              value: 5,
            },
          },
        ],
      }],
      out: false,
      want: { value: 5, txID: "inTXID" },
    },

  ]
  /* eslint-enable @typescript-eslint/camelcase */

  testCases.forEach((tc) => {
    it(`should return amount and transactionID from an address ${tc.name}`, async () => {
      const mockedAxios = jest.spyOn(axios, "get").mockImplementationOnce(() => Promise.resolve({ status: 200, data: tc.transactions }))
      const result = await blockstream.getValueFromLastTransaction(address, tc.out)

      expect(result.value).toEqual(tc.want.value)
      expect(result.txID).toEqual(tc.want.txID)
      expect(mockedAxios).toHaveBeenCalledTimes(1)
      expect(mockedAxios).toHaveBeenCalledWith(`https://blockstream.info/api/address/${address}/txs`)
    })
  })

  it("should throw an error if the API does not return a status 200", async () => {
    const mockedAxios = jest.spyOn(axios, "get").mockImplementation(() => Promise.resolve({ status: 400, data: "error message" }))
    await expect(blockstream.getValueFromLastTransaction("ADDRESS1", true)).rejects.toThrow()
    await expect(blockstream.getValueFromLastTransaction("ADDRESS2", false)).rejects.toThrow()
  })
  it("should throw an error if no matching address is found", async () => {
    const mockedAxios = jest.spyOn(axios, "get").mockImplementation(() => Promise.resolve({ status: 200, data: [] }))
    await expect(blockstream.getValueFromLastTransaction("ADDRESS1", true)).rejects.toThrow()
    await expect(blockstream.getValueFromLastTransaction("ADDRESS2", false)).rejects.toThrow()
  })
})



describe("getOutput()", () => {
  const address = "ADDRESS"

  /* eslint-disable @typescript-eslint/camelcase */
  const testCases = [
    {
      name: "a single output",
      txID: "ID1",
      data: {
        txid: "outTXID2",
        scriptpubkey_address: address,
        value: 111111111,
      },
      want: {
        vout: 1,
        value: 1,
      },
    },
    {
      name: "multiple outputs",
      txID: "ID2",
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
      want: {
        vout: 1,
        value: 1,
      },
    },
  ]
  /* eslint-enable @typescript-eslint/camelcase */

  testCases.forEach((tc) => {
    //   it.skip(`should return amount and vout index from a transaction with ${tc.name}`, async () => {
    //     const mockedAxios = jest.spyOn(axios, "get").mockImplementationOnce(() => Promise.resolve({ data: tc.data }))
    //     const {vout, value} = await blockstream.getOutput(tc.txID)

    //     expect(vout).toBe(tc.want.vout)
    //     expect(value).toBe(tc.want.value)

    //     // expect(mockedAxios).toHaveBeenCalledTimes(1)
    //     // expect(mockedAxios).toHaveBeenCalledWith(`https://blockstream.info/api/address/${address}/txs`)
    //   })
  })
})