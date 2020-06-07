import * as bitcoin from "bitcoinjs-lib"
import { getSecret } from "./secret"

describe("Secret generator", () => {
  const length = 32
  const secretObj = getSecret(length)
  const secretObj2 = getSecret(length)
  it("should hash the secret to same hash", () => {
    expect(secretObj.hash).toEqual(bitcoin.crypto.sha256(Buffer.from(secretObj.preimage)))
  })
  it("should return a secret with the requested length", () => {
    expect(secretObj.preimage.length).toBe(length)
  })
  it("should return two different secrets when executing the secret generator twice", () => {
    expect(secretObj.preimage).not.toBe(secretObj2.preimage)
  })
})
