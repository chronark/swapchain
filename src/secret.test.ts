import { SHA256 } from "crypto-js"
import { getSecret } from "./secret"

test("XXX", () => {
  const secretObj = getSecret()

  expect(secretObj.hash).toBe(SHA256(secretObj.secret).toString())
})
