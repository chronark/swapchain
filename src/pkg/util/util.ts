import * as bitcoin from "bitcoinjs-lib"

export const fakeKey = (length: number, network?: string) => {
  let prefix = ""
  if (network === "mainnet") {
    prefix = "L"
  } else if (network === "testnet") {
    prefix = "c"
  }

  return prefix + hash(Math.random().toString()).substring(0, length)
}

export const hash = (s: string): string => {
  return bitcoin.crypto.hash256(Buffer.from(s)).toString("hex")
}

export const toPublicKey = (privateKey: string): string => {
  const keyPair = bitcoin.ECPair.fromWIF(privateKey, bitcoin.networks.testnet)
  const keyPairCompressed = bitcoin.ECPair.fromPrivateKey(keyPair.privateKey!, { compressed: true })
  return keyPairCompressed.publicKey.toString("hex")
}
