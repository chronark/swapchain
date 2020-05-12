import * as bitcoin from "bitcoinjs-lib"
import { getBTCAddress } from "./address"

describe("BTC address generator", () => {
  const addressPair = getBTCAddress("bitcoin")
  const addressPair2 = getBTCAddress("testnet")
  it("should return an address with 1, n or m as first char", () => {
    expect(addressPair.address.startsWith("1")).toBe(true)
    expect(addressPair2.address.startsWith("m") || addressPair2.address.startsWith("n")).toBe(true)
  })
})
