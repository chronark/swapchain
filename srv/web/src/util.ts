import crypto from "crypto"

export const fakeKey = (length: number, network: string) => {
  let prefix: string
  if (network === "mainnet") {
    prefix = "L"
  } else if (network === "testnet") {
    prefix = "c"
  } else {
    throw new Error("Invalid network name. Choose mainnet or testnet.")
  }
  
  return prefix + hash(Math.random().toString()).substring(0, length) + "..."
}

export const hash = (s: string): string => {
  return crypto.createHash("SHA256").update(s).digest("hex")
}
