import { getFeesBTC } from "./btcTxFees"

// eslint-disable-next-line @typescript-eslint/no-var-requires
jest.mock("node-fetch", () => require("fetch-mock-jest").sandbox())
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetchMock = require("node-fetch")

beforeAll(async () => {
  fetchMock.get("begin:https://blockstream.info/api/fee-estimates", {
    "20": 4.003,
    "18": 4.003,
    "4": 36.071,
    "21": 4.003,
    "22": 4.003,
    "7": 32.514,
    "24": 4.003,
    "25": 4.003,
    "504": 4.003,
    "1": 36.071,
    "1008": 4.003,
    "5": 36.071,
    "14": 4.003,
    "23": 4.003,
    "12": 4.003,
    "15": 4.003,
    "144": 4.003,
    "6": 32.514,
    "11": 4.003,
    "16": 4.003,
    "19": 4.003,
    "2": 36.071,
    "3": 36.071,
    "9": 4.003,
    "8": 4.003,
    "13": 4.003,
    "17": 4.003,
    "10": 4.003,
  })
})

test("compares the values of the Fee estimates provided by the API", async () => {
  const values = await getFeesBTC()
  expect(values.length).toBe(5)
  expect(values[0]).toBe(36.071 * 250)
  expect(values[1]).toBe(32.514 * 250)
  expect(values[2]).toBe(4.003 * 250)
  expect(values[3]).toBe(4.003 * 250)
  expect(values[4]).toBe(4.003 * 250)
})
