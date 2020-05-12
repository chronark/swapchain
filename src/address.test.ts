import * as bitcoin from "bitcoinjs-lib"
import { getBTCAddress } from "./address"

describe("BTC address generator", () => {
  const addressPair = getBTCAddress("bitcoin")
  const addressPair2 = getBTCAddress("testnet")

  it("should return an address with 1, n or m as first char", () => {
    expect(addressPair.address.startsWith("1")).toBe(true)
    expect(addressPair2.address.startsWith("m") || addressPair2.address.startsWith("n")).toBe(true)
  })

  it("should be possible to calculate address with privateKey", () => {
    const keyPair = bitcoin.ECPair.fromWIF(addressPair.privateKey)
    const address = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: bitcoin.networks.bitcoin }).address

    expect(address).toBe(addressPair.address)
  })
})
