import Blockstream from "./blockstream"
// eslint-disable-next-line @typescript-eslint/no-var-requires
jest.mock("node-fetch", () => require("fetch-mock-jest").sandbox())
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetchMock = require("node-fetch")

describe("getLastBlock()", () => {
  const blockstream = new Blockstream()

  it("should return height and timestamp of the last block on the blockchain", async () => {
    const hash = "HASH"

    fetchMock.get("https://blockstream.info/api/blocks/tip/hash", hash)
    fetchMock.get("https://blockstream.info/api/block/" + hash, { height: 9000, timestamp: 9001 })

    expect(await blockstream.getLastBlock()).toEqual({ height: 9000, timestamp: 9001 })
  })
})
