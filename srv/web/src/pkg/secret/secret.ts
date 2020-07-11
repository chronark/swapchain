import * as bitcoin from "bitcoinjs-lib"
import crypto from "crypto-random-string"

/**
 * An interface for a secret/hash pair
 */
export interface Secret {
  preimage?: string
  hash: Buffer
}

/**
 * A function for generating and hashing a crypto random string with a length of 32.
 * The length of the secret can not be changed!
 *
 * @returns An Secret object.
 */
export function getSecret(): Secret {
  const preimage = crypto({ length: 32, type: "base64" })
  const hash = bitcoin.crypto.sha256(Buffer.from(preimage))
  return {
    preimage,
    hash,
  }
}
