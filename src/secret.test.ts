import { SHA256 } from "crypto-js"
import { getSecret } from "./secret"

  describe("Secret generator", () => {
    const length = 32
    const secretObj = getSecret(length)
    const secretObj2 = getSecret(length)
    it("should hash the secret to same hash", () => {
      expect(secretObj.hash).toBe(SHA256(secretObj.secret).toString())
    })
    it("should return a secret with the requested length", () => {
      expect(secretObj.secret.length).toBe(length)
    })
    it("should return two different secrets when executing the secret generator twice", () => {
      expect(secretObj.secret).not.toBe(secretObj2.secret)
    })
})
