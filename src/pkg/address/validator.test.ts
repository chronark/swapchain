import { isValidBitcoinPrivateKey, isValidBitsharesPrivateKey, isValidBitcoinPublicKey } from "./validator"

describe("key validators", () => {
  it("validates a Bitcoin private key on mainnet as valid", () => {
    expect(isValidBitcoinPrivateKey("L2kFjyRuJ3gEUwgw7JGRP72b4Fmgcw7kXX793BKNCXJvDfNHebRC", "mainnet")).toBe(true)
  })
  it("validates a Bitcoin private key on testnet as valid", () => {
    expect(isValidBitcoinPrivateKey("cVPwsbE8HNMCoLGz8N4R2SfyQTMQzznL9x3vEHJqPtuZ1rhBkTo7", "testnet")).toBe(true)
  })
  it("validates a wrong Bitcoin private key on mainnet as invalid", () => {
    expect(isValidBitcoinPrivateKey("TOTALLYWRONG", "mainnet")).toBe(false)
  })
  it("validates a wrong Bitcoin private key on testnet as invalid", () => {
    expect(isValidBitcoinPrivateKey("TOTALLYWRONG", "testnet")).toBe(false)
  })
  it("throws an error for wrong network", () => {
    expect(() =>
      isValidBitcoinPrivateKey("cVPwsbE8HNMCoLGz8N4R2SfyQTMQzznL9x3vEHJqPtuZ1rhBkTo7", "TOTALLYWRONG"),
    ).toThrow()
  })
  it("validates a Bitcoin public key as valid", () => {
    expect(isValidBitcoinPublicKey("034c7ddacc16fa5e53aa5dc19748e3877ba07b981fdbbcdb97b8b19de240241f61")).toBe(true)
  })
  it("validates a wrong Bitcoin public key as invalid", () => {
    expect(isValidBitcoinPublicKey("TOTALLYWRONG")).toBe(false)
  })
  it("validates a Bitshares private key as valid", () => {
    expect(isValidBitsharesPrivateKey("5T54Ve18ttnu7Ymd1nnCMsnGkfZz4KQnsfFrYEz7Cmw39FAMOSN")).toBe(true)
  })
  it("validates a wrong Bitshares private key as invalid", () => {
    expect(isValidBitsharesPrivateKey("TOTALLYWRONG")).toBe(false)
  })
  it("validates a 51 character long bitcoin private key as invalid", () => {
    expect(isValidBitcoinPrivateKey("123456789012345678901234567890123456789012345678901", "mainnet")).toBe(false)
  })
})
