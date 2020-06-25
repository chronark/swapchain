import Blockstream from "./blockstream"

import axios from "axios"

jest.mock("axios")

beforeEach(() => {
  jest.resetAllMocks()
})

const blockstream = new Blockstream()

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
  it.skip("should return the timestamp of the requested block on the blockchain", async () => {
    const height = 9001
    const hash = "HASH"

    const mockedAxios = jest
      .spyOn(axios, "get")
      .mockImplementationOnce(() => Promise.resolve(hash))
      .mockImplementationOnce(() => Promise.resolve({ data: { timestamp: 111111111 } }))

    const result = await blockstream.getLastBlock()

    expect(result).toEqual({ height: 9000, timestamp: 9001 })
    expect(mockedAxios).toHaveBeenCalledTimes(2)
    expect(mockedAxios).toHaveBeenCalledWith("https://blockstream.info/api/block-height/")
    expect(mockedAxios).toHaveBeenCalledWith("https://blockstream.info/api/block/" + hash)
  })
})
