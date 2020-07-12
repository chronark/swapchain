import * as bitcoin from "bitcoinjs-lib"
import { PrivateKey } from "bitsharesjs"
import { getBTCAddress, getBTSAddress } from "./address"

describe("BTC address generator", () => {
  const addressPair = getBTCAddress("mainnet")
  const addressPair2 = getBTCAddress("testnet")
  const addressPair3 = getBTCAddress("regtest")

  it("should return an address starting with bc1, tb1 or bcrt1", () => {
    expect(addressPair.address.startsWith("bc1")).toBe(true)
    expect(addressPair2.address.startsWith("tb1")).toBe(true)
    expect(addressPair3.address.startsWith("bcrt1")).toBe(true)
  })
  it("should be possible to calculate address with privateKey", () => {
    const keyPair = bitcoin.ECPair.fromWIF(addressPair.privateKey)
    const address = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: bitcoin.networks.bitcoin }).address
    expect(addressPair.address).toBe(address)
  })
  it("should return an error with an invalid network", () => {
    expect(() => getBTCAddress("XYZ")).toThrow("Invalid network name. Choose bitcoin, testnet or regtest.")
  })
  it("should return an error if address is undefined", () => {
    jest.spyOn(bitcoin.payments, "p2wpkh").mockImplementation((): bitcoin.payments.Payment => ({}))
    expect(() => getBTCAddress("testnet")).toThrow("Unknown error during address generation.")
  })
})

describe("BTS address generator", () => {
  const addressPair = getBTSAddress("mainnet")
  const addressPair2 = getBTSAddress("testnet")

  it("should return an address starting with the corresponding network prefix", () => {
    expect(addressPair.address.startsWith("BTS")).toBe(true)
    expect(addressPair2.address.startsWith("TEST")).toBe(true)
  })
  it("should be possible to calculate address with privateKey", () => {
    const privateKey = PrivateKey.fromWif(addressPair2.privateKey)
    const address = privateKey.toPublicKey().toAddressString()
    expect(address).toBe(addressPair2.address)
  })
  it("should return an error with an invalid network", () => {
    expect(() => getBTSAddress("XYZ")).toThrow("Invalid network name. Choose mainnet or testnet.")
  })
})
