import { Timer } from "./timer"
import { BlockStream } from "../bitcoin/api/blockstream"
jest.mock("../bitcoin/api/blockstream")

describe("constructor()", () => {
  it("throws because the blockSequence is too high", () => {
    expect(() => new Timer(21, "network", BlockStream)).toThrow()
  })
  it("throws because the blockSequence is too low", () => {
    expect(() => new Timer(5, "network", BlockStream)).toThrow()
  })
})

describe("toBTS()", () => {
  describe("with a user set blockHeightDifference", () => {})

  const testCases = [
    {
      blockHeightDifference: 10,
      sequence: 6,
      want: (200_000 / 10) * 6, // timestampDiff / blockHeightDifference * sequence
    },
    {
      blockHeightDifference: 100,
      sequence: 10,
      want: (200_000 / 100) * 10,
    },
    {
      blockHeightDifference: 1000,
      sequence: 20,
      want: (200_000 / 1_000) * 20,
    },
  ]

  testCases.forEach((tc) => {
    it(`converts the sequence to Bitshares timelock correctly`, () => {
      jest.spyOn(BlockStream.prototype, "getLastBlock").mockResolvedValue({ height: 1000, timestamp: 1_000_000 })
      jest.spyOn(BlockStream.prototype, "getTimestampAtHeight").mockResolvedValue(800_000)

      const timer = new Timer(tc.sequence, "network", BlockStream)
      expect(timer.toBTS(tc.blockHeightDifference)).resolves.toBe(tc.want)
    })
  })

  describe("with the default blockHeightDifference", () => {
    it("converts the sequence to Bitshares timelock correctly", () => {
      jest.spyOn(BlockStream.prototype, "getLastBlock").mockResolvedValue({ height: 1000, timestamp: 1_000_000 })
      jest.spyOn(BlockStream.prototype, "getTimestampAtHeight").mockResolvedValue(800_000)

      const timer = new Timer(6, "network", BlockStream)
      expect(timer.toBTS()).resolves.toBe(120_000)
    })
  })
})

it("returns the sequence for Bitcoin", () => {
  const timer = new Timer(10, "network", BlockStream)
  expect(timer.toBTC()).toBe(10)
})
