import { SHA256 } from "crypto-js"
import { getSecret } from "./secret"

describe("Secret generator", () => {
  const length = 32
  const secretObj = getSecret(length)
  it("should hash the secret to same hash", () => {
    expect(secretObj.hash).toBe(SHA256(secretObj.secret).toString())
  })
  it("should return a secret with the requested length", () => {
    expect(secretObj.secret.length).toBe(length)
  })
})
