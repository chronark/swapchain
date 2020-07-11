import * as bitcoin from "bitcoinjs-lib"
import { getSecret } from "./secret"

describe("Secret generator", () => {
  const secretObj = getSecret()
  const secretObj2 = getSecret()
  it("should hash the secret to same hash", () => {
    expect(secretObj.hash).toEqual(bitcoin.crypto.sha256(Buffer.from(secretObj.preimage!)))
  })
  it("should return a secret with length 32", () => {
    expect(secretObj.preimage!.length).toBe(32)
  })
  it("should return two different secrets when executing the secret generator twice", () => {
    expect(secretObj.preimage).not.toBe(secretObj2.preimage)
  })
})
