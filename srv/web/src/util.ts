import crypto from "crypto"

export const fakeAddress = (length: number) => {
  return hash(Math.random().toString()).substring(0, length) + "..."
}

export const hash = (s: string): string => {
  return crypto.createHash("SHA256").update(s).digest("hex")
}
