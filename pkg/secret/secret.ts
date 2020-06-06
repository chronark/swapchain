import * as bitcoin from "bitcoinjs-lib"
import crypto from "crypto-random-string"

/**
 * An interface for a secret/hash pair
 */
export interface Secret {
  preimage: string
  hash: Buffer
}

/**
 * A function for hashing a crypto random string.
 *
 * @param length The length of the requested secret
 * @returns An Secret interface with a secret/hash pair
 *
 */
export function getSecret(length: number): Secret {
  const preimage = crypto({ length, type: "base64" })
  const hash = bitcoin.crypto.sha256(Buffer.from(preimage))
  return {
    preimage,
    hash,
  }
}
