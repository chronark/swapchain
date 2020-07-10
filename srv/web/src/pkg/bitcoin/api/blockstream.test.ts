import { BlockStream } from "./blockstream"
import axios from "axios"
jest.mock("axios")

beforeEach(() => {
  jest.resetAllMocks()
})

const blockstream = new BlockStream("")

describe("constructor()", () => {
  it("sets the api url to 'testnet'", () => {
    const blockstream = new BlockStream("testnet")
    expect(blockstream.baseURL).toBe("https://blockstream.info/testnet/api")
  })
  it("sets the api url to 'mainnet'", () => {
    const blockstream = new BlockStream("anything else")
    expect(blockstream.baseURL).toBe("https://blockstream.info/api")
  })
})

describe("getLastBlock()", () => {
  const hash = "HASH"

  it("should return height and timestamp of the last block on the blockchain", async () => {
    const mockedAxios = jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce({ status: 200, data: hash })
      .mockResolvedValueOnce({ status: 200, data: { height: 9000, timestamp: 9001 } })

    const result = await blockstream.getLastBlock()

    expect(result).toEqual({ height: 9000, timestamp: 9001 })
    expect(mockedAxios).toHaveBeenCalledTimes(2)
    expect(mockedAxios).toHaveBeenCalledWith("https://blockstream.info/api/blocks/tip/hash")
    expect(mockedAxios).toHaveBeenCalledWith("https://blockstream.info/api/block/" + hash)
  })
  it("should throw an error if the first API call does not return a status 200", async () => {
    const mockedAxios = jest.spyOn(axios, "get").mockResolvedValueOnce({})
    await expect(blockstream.getLastBlock()).rejects.toThrow()
  })
  it("should throw an error if the second API call does not return a status 200", async () => {
    const mockedAxios = jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce({ status: 200, data: hash })
      .mockResolvedValueOnce({ status: 404, data: "Block not found" })
    await expect(blockstream.getLastBlock()).rejects.toThrow()
  })
})

describe("getTimestampAtHeight()", () => {
  const height = 9001
  const hash = "HASH"

  it("should return the timestamp of the requested block on the blockchain", async () => {
    const mockedAxios = jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce({ status: 200, data: hash })
      .mockResolvedValueOnce({ status: 200, data: { timestamp: 1234567890 } })

    const result = await blockstream.getTimestampAtHeight(height)

    expect(result).toBe(1234567890)
    expect(mockedAxios).toHaveBeenCalledTimes(2)
    expect(mockedAxios).toHaveBeenCalledWith("https://blockstream.info/api/block-height/" + height)
    expect(mockedAxios).toHaveBeenCalledWith("https://blockstream.info/api/block/" + hash)
  })
  it("should throw an error if the first API call does not return a status 200", async () => {
    const mockedAxios = jest.spyOn(axios, "get").mockResolvedValueOnce({})
    await expect(blockstream.getTimestampAtHeight(height)).rejects.toThrow()
  })
  it("should throw an error if the second API call does not return a status 200", async () => {
    const mockedAxios = jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce({ status: 200, data: hash })
      .mockResolvedValueOnce({ status: 404, data: "Block not found" })
    await expect(blockstream.getTimestampAtHeight(height)).rejects.toThrow()
  })
})
describe("pushTX()", () => {
  it("should make post request to blockstream and return the transactionID", async () => {
    const transactionHex = "transactionHex"
    const transactionID = "transactionID"

    const mockedAxios = jest.spyOn(axios, "post").mockResolvedValueOnce({ status: 200, data: transactionID })

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

    const mockedAxios = jest.spyOn(axios, "post").mockResolvedValueOnce({ status: 400 })

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
      transactions: [
        {
          txid: "outTXID2",
          vout: [
            {
              scriptpubkey_address: address,
              value: 111111111,
            },
          ],
          status: {
            confirmed: true,
          },
        },
      ],
      out: true,
      want: { value: 111111111, txID: "outTXID2" },
    },
    {
      name: "output from multiple transactions",
      transactions: [
        {
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
          status: {
            confirmed: true,
          },
        },
      ],
      out: true,
      want: { value: 3, txID: "outTXID2" },
    },
  ]
  /* eslint-enable @typescript-eslint/camelcase */

  testCases.forEach((tc) => {
    it(`should return amount and transactionID from an address ${tc.name}`, async () => {
      const mockedAxios = jest.spyOn(axios, "get").mockResolvedValueOnce({ status: 200, data: tc.transactions })
      const result = await blockstream.getValueFromLastTransaction(address)

      expect(result.value).toEqual(tc.want.value)
      expect(result.txID).toEqual(tc.want.txID)
      expect(mockedAxios).toHaveBeenCalledTimes(1)
      expect(mockedAxios).toHaveBeenCalledWith(`https://blockstream.info/api/address/${address}/txs`)
    })
  })
  it("throws if address is correct but transaction isn't confirmed yet", async () => {
    const mockedAxios = jest.spyOn(axios, "get").mockResolvedValueOnce({
      status: 200,
      data: {
        txid: "testID",
        vout: [
          {
            scriptpubkey_address: address,
            value: 1,
          },
        ],
        status: { confirmed: false },
      },
    })

    await expect(blockstream.getValueFromLastTransaction(address)).rejects.toThrow()
  })
})

describe("getPreimageFromLastTransaction()", () => {
  const address = "ADDRESS"
  const validWitness = "524a486e415350432b74705473637653444c382f6c4d72344d577a6470446438"
  const decodedWitness = "RJHnASPC+tpTscvSDL8/lMr4MWzdpDd8"

  const testCases = [
    {
      name: "input from a single transaction",
      transactions: [
        {
          txid: "inTXID",
          vin: [
            {
              prevout: {
                /* eslint-disable-next-line @typescript-eslint/camelcase */
                scriptpubkey_address: address,
                value: 5,
              },
              witness: ["first one", validWitness],
            },
          ],
        },
      ],
      want: decodedWitness,
    },
    {
      name: "input from multiple transactions",
      transactions: [
        {
          txid: "inTXID",
          vin: [
            {
              prevout: {
                /* eslint-disable-next-line @typescript-eslint/camelcase */
                scriptpubkey_address: "OTHER ADDRESS",
                value: 55,
              },
              witness: ["first one", "wrong one"],
            },
            {
              prevout: {
                /* eslint-disable-next-line @typescript-eslint/camelcase */
                scriptpubkey_address: address,
                value: 5,
              },
              witness: ["first one", validWitness],
            },
          ],
        },
      ],
      want: decodedWitness,
    },
  ]

  testCases.forEach((tc) => {
    it(`should return amount and transactionID from an address ${tc.name}`, async () => {
      const mockedAxios = jest.spyOn(axios, "get").mockResolvedValueOnce({ status: 200, data: tc.transactions })
      const preimage = await blockstream.getPreimageFromLastTransaction(address)
      expect(preimage).toEqual(tc.want)
      expect(mockedAxios).toHaveBeenCalledTimes(1)
      expect(mockedAxios).toHaveBeenCalledWith(`https://blockstream.info/api/address/${address}/txs`)
    })
  })

  it("should throw an error if the API does not return a status 200", async () => {
    const mockedAxios = jest.spyOn(axios, "get").mockResolvedValue({ status: 400, data: "error message" })
    await expect(blockstream.getValueFromLastTransaction("ADDRESS1")).rejects.toThrow()
    await expect(blockstream.getPreimageFromLastTransaction("ADDRESS2")).rejects.toThrow()
  })
  it("should throw an error if no matching address is found", async () => {
    const mockedAxios = jest.spyOn(axios, "get").mockResolvedValue({ status: 200, data: [] })
    await expect(blockstream.getValueFromLastTransaction("ADDRESS1")).rejects.toThrow()
    await expect(blockstream.getPreimageFromLastTransaction("ADDRESS2")).rejects.toThrow()
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
        vout: [
          {
            txid: "outTXID2",
            scriptpubkey_address: address,
            value: 111111111,
          },
        ],
      },
      want: {
        vout: 0,
        value: 111111111,
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
        value: 111111111,
      },
    },
  ]
  /* eslint-enable @typescript-eslint/camelcase */

  testCases.forEach((tc) => {
    it(`should return amount and vout index from a transaction with ${tc.name}`, async () => {
      const mockedAxios = jest.spyOn(axios, "get").mockResolvedValueOnce({ data: tc.data, status: 200 })
      const { vout, value } = await blockstream.getOutput(tc.txID, address)

      expect(vout).toBe(tc.want.vout)
      expect(value).toBe(tc.want.value)

      expect(mockedAxios).toHaveBeenCalledTimes(1)
      expect(mockedAxios).toHaveBeenCalledWith(`https://blockstream.info/api/tx/${tc.txID}`)
    })
  })
  it("should throw an error if the API does not return a status 200", async () => {
    const mockedAxios = jest.spyOn(axios, "get").mockResolvedValueOnce({ status: 400, data: "Invalid hex string" })
    await expect(blockstream.getOutput("testTxID", "BADADDRESS")).rejects.toThrow()
  })
  it("should throw an error if no matching output is found", async () => {
    const mockedAxios = jest.spyOn(axios, "get").mockResolvedValueOnce({ status: 200, data: { vout: [] } })
    await expect(blockstream.getOutput("testTxID", "BADADDRESS")).rejects.toThrow()
  })
})

describe("getBlockHeight()", () => {
  /* eslint-disable @typescript-eslint/camelcase */
  const transaction1 = {
    name: "unconfirmed transaction",
    txID: "ID1",
    data: {
      status: {
        confirmed: false,
      },
    },
    want: {
      confirmed: false,
    },
  }
  const transaction2 = {
    name: "confirmed transaction",
    txID: "ID2",
    data: {
      status: {
        confirmed: true,
        block_height: 1,
      },
    },
    want: {
      confirmed: true,
      block_height: 1,
    },
  }
  /* eslint-enable @typescript-eslint/camelcase */

  it(`should return undefined from an unconfirmed transaction`, async () => {
    const mockedAxios = jest.spyOn(axios, "get").mockResolvedValueOnce({ data: transaction1.data, status: 200 })
    const blockHeight = await blockstream.getBlockHeight(transaction1.txID)

    expect(blockHeight).toBeUndefined()

    expect(mockedAxios).toHaveBeenCalledTimes(1)
    expect(mockedAxios).toHaveBeenCalledWith(`https://blockstream.info/api/tx/${transaction1.txID}`)
  })
  it(`should return block height from a confirmed transaction`, async () => {
    const mockedAxios = jest.spyOn(axios, "get").mockResolvedValueOnce({ data: transaction2.data, status: 200 })
    const blockHeight = await blockstream.getBlockHeight(transaction2.txID)

    expect(blockHeight).toBe(transaction2.want.block_height)

    expect(mockedAxios).toHaveBeenCalledTimes(1)
    expect(mockedAxios).toHaveBeenCalledWith(`https://blockstream.info/api/tx/${transaction2.txID}`)
  })
  it("should throw an error if the API does not return a status 200", async () => {
    const mockedAxios = jest.spyOn(axios, "get").mockResolvedValueOnce({ status: 404, data: "Transaction not found" })
    await expect(blockstream.getBlockHeight("testTxID")).rejects.toThrow()
  })
})

describe("getFeeEstimates()", () => {
  /* eslint-disable @typescript-eslint/camelcase */
  const testCases = [
    {
      name: "return 3 values",
      data: {
        1: 25.5,
        15: 8.4,
        5: 16.9,
        9: 16.7,
        20: 2.2,
        21: 2.2,
        22: 2.1,
      },
      want: [25.5, 16.7, 8.4],
    },
    {
      name: "return 2 values",
      data: {
        10: 7,
        1: 30,
        3: 20,
        7: 7,
      },
      want: [30, 20],
    },
    {
      name: "return 1 value",
      data: {
        20: 1,
        10: 1,
        1: 1,
      },
      want: [1],
    },
  ]
  /* eslint-enable @typescript-eslint/camelcase */

  testCases.forEach((tc) => {
    it(`should get the fee estimates and ${tc.name}`, async () => {
      const mockedAxios = jest.spyOn(axios, "get").mockResolvedValueOnce({ data: tc.data, status: 200 })
      const feeEstimates = await blockstream.getFeeEstimates()

      expect(feeEstimates).toEqual(tc.want)

      expect(mockedAxios).toHaveBeenCalledTimes(1)
      expect(mockedAxios).toHaveBeenCalledWith("https://blockstream.info/api/fee-estimates")
    })
  })
  it("should throw an error if the API does not return a status 200", async () => {
    const mockedAxios = jest.spyOn(axios, "get").mockResolvedValueOnce({})
    await expect(blockstream.getFeeEstimates()).rejects.toThrow()
  })
})
