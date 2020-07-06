import { isValidPrivateKeyBTC, isValidPrivateKeyBTS, isValidPublicKeyBTC} from "./validator"

describe("key validators", () => {
    it("validates a Bitcoin private key on mainnet as valid",() => {
        expect(isValidPrivateKeyBTC("L2kFjyRuJ3gEUwgw7JGRP72b4Fmgcw7kXX793BKNCXJvDfNHebRC", "mainnet")).toBe(true)
    })
    it("validates a Bitcoin private key on testnet as valid",() => {
        expect(isValidPrivateKeyBTC("cVPwsbE8HNMCoLGz8N4R2SfyQTMQzznL9x3vEHJqPtuZ1rhBkTo7", "testnet")).toBe(true)
    })
    it("validates a wrong Bitcoin private key on mainnet as invalid", () => {
        expect(isValidPrivateKeyBTC("TOTALLYWRONG", "mainnet")).toBe(false)
    })
    it("validates a wrong Bitcoin private key on testnet as invalid", () => {
        expect(isValidPrivateKeyBTC("TOTALLYWRONG", "testnet")).toBe(false)
    })
    it("throws an error for wrong network", () => {
        expect(() => isValidPrivateKeyBTC("cVPwsbE8HNMCoLGz8N4R2SfyQTMQzznL9x3vEHJqPtuZ1rhBkTo7", "TOTALLYWRONG")).toThrow()
    })
    it("validates a Bitcoin public key as valid",() => {
        expect(isValidPublicKeyBTC("034c7ddacc16fa5e53aa5dc19748e3877ba07b981fdbbcdb97b8b19de240241f61")).toBe(true)
    })
    it("validates a wrong Bitcoin public key as invalid",() => {
        expect(isValidPublicKeyBTC("TOTALLYWRONG")).toBe(false)
    })
    it("validates a Bitshares private key as valid",() => {
        expect(isValidPrivateKeyBTS("5T54Ve18ttnu7Ymd1nnCMsnGkfZz4KQnsfFrYEz7Cmw39FAMOSN")).toBe(true)
    })
    it("validates a wrong Bitshares private key as invalid",() => {
        expect(isValidPrivateKeyBTS("TOTALLYWRONG")).toBe(false)
    })
})