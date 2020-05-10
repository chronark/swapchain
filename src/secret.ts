import { SHA256 } from "crypto-js"
import crypto from "crypto-random-string"

/**
 * @returns JS Object containing secret and hash
 */
export function getSecret(): { secret: string; hash: string } {
  const secret = crypto({ length: 32, type: "base64" })
  const hash = SHA256(secret).toString()
  return {
    secret,
    hash,
  }
}
