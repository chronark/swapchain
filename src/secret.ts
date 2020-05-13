import { SHA256 } from "crypto-js"
import crypto from "crypto-random-string"

/**
 * An interface for a secret/hash pair
 */
export interface Secret {
  secret: string
  hash: string
}

/**
 * A function for hashing a crypto random string.
 *
 * @param length The length of the requested secret
 * @returns An Secret interface with a secret/hash pair
 *
 */
export function getSecret(length: number): Secret {
  const secret = crypto({ length, type: "base64" })
  const hash = SHA256(secret).toString()
  return {
    secret,
    hash,
  }
}
