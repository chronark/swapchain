import { SHA256 } from "crypto-js"
import { getSecret } from "./secret"

test("should hash the secret to same hash", () => {
  const secretObj = getSecret()

  expect(secretObj.hash).toBe(SHA256(secretObj.secret).toString())
})
