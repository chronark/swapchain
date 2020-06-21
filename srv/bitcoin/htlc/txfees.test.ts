import { getFeesBTC } from "./txfees"
jest.mock("node-fetch", () => require("fetch-mock-jest").sandbox())
import { fetchMock } from "node-fetch"


it("returns json including transaction fees which we calculate with", () => {
  fetchMock.get("https://blockstream.info/api/fee-estimates").then((res: any) => res.json())
})

test("checks the fetch data", async () => {
  const value = await getFeesBTC()
  const x = "some data"
  expect(value).not.toBe(x)
})

test("compares the values of the fee estimates", async () => {
  const value = await getFeesBTC()
  expect(value.length).toBe(5)
  expect(value[0]).toBeGreaterThanOrEqual(value[1])
  expect(value[1]).toBeGreaterThanOrEqual(value[2])
  expect(value[2]).toBeGreaterThanOrEqual(value[3])
  expect(value[3]).toBeGreaterThanOrEqual(value[4])
})
