import { getAddress } from "./getAddress"
import { mocked } from "ts-jest/utils"
import { BTCAddress, BTSAddress, getBTCAddress, getBTSAddress } from "./address"
jest.mock("./address")

describe("getAddress script", () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.spyOn(console, "log").mockImplementation(() => {})
  })

  it("should call getBTCAddress and print to stdout", () => {
    mocked(getBTCAddress).mockImplementation(
      (network: string): BTCAddress => {
        return {
          privateKey: "testPrivateKey",
          publicKey: "testPublicKey",
          address: "testAddress",
        }
      },
    )
    getAddress(["node", "getAddress.js", "bitcoin", "testnet"])

    expect(console.log).toHaveBeenCalledTimes(3)
    expect(getBTCAddress).toHaveBeenCalledTimes(1)
    expect(getBTCAddress).toHaveBeenCalledWith("testnet")
  })

  it("should call getBTSAddress and print to stdout", () => {
    mocked(getBTSAddress).mockImplementation(
      (network: string): BTSAddress => {
        return {
          privateKey: "testKey",
          address: "testAddress",
        }
      },
    )
    getAddress(["node", "getAddress.js", "bitshares", "mainnet"])

    expect(console.log).toHaveBeenCalledTimes(2)
    expect(getBTSAddress).toHaveBeenCalledTimes(1)
    expect(getBTSAddress).toHaveBeenCalledWith("mainnet")
  })

  it("should throw an error for too many arguments", () => {
    expect(() => getAddress(["node", "getAddress.js", "bitshares", "mainnet", "tooMany"])).toThrow(
      "Usage: node getAddress.js cryptocurrency network",
    )
  })

  it("should throw an error for unknown cryptocurrency", () => {
    expect(() => getAddress(["node", "getAddress.js", "XXX", "mainnet"])).toThrow(
      "Only Bitcoin and Bitshares are supported.",
    )
  })

  it("should throw an error for unknown network", () => {
    expect(() => getAddress(["node", "getAddress.js", "bitcoin", "ZZZ"])).toThrow(
      "Only mainnet, testnet and regtest are supported.",
    )
  })

  it("should throw an error for bad combination", () => {
    expect(() => getAddress(["node", "getAddress.js", "bitshares", "regtest"])).toThrow(
      "Bitshares doesn't support regtest.",
    )
  })
})
