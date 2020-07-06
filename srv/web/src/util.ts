import crypto from "crypto"
import * as bitcoin from "bitcoinjs-lib"

export const fakeAddress = (length: number) => {
  return hash(Math.random().toString()).substring(0, length) + "..."
}

export const hash = (s: string): string => {
  return crypto.createHash("SHA256").update(s).digest("hex")
}

export const getPublicKey = (privateKey: string): string => {
  if (!privateKey) {
    return ""
  }

  let keyPair: bitcoin.ECPairInterface
  try {
    keyPair = bitcoin.ECPair.fromWIF(privateKey, bitcoin.networks.testnet)
  } catch (err) {
    return "Invalid private key"
  }

  const keyPairCompressed = bitcoin.ECPair.fromPrivateKey(keyPair.privateKey!, { compressed: true })

  return keyPairCompressed.publicKey.toString("hex")
}
