import { getBTCAddress, getBTSAddress } from "./address"

/**
 * @param processArgv
 */
export function getAddress(processArgv: string[]): void {
  const argv = processArgv.slice(2)

  if (argv.length !== 2) {
    throw new Error("Usage: node getAddress.js cryptocurrency network")
  }

  if (!["bitcoin", "bitshares"].includes(argv[0])) {
    throw new Error("Only Bitcoin and Bitshares are supported.")
  }

  if (!["mainnet", "testnet", "regtest"].includes(argv[1])) {
    throw new Error("Only mainnet, testnet and regtest are supported.")
  }

  if (argv[0] === "bitshares" && argv[1] === "regtest") {
    throw new Error("Bitshares doesn't support regtest.")
  }

  if (argv[0] === "bitcoin") {
    const addressPair = getBTCAddress(argv[1])
    console.log("Compressed private key (WIF): " + addressPair.privateKey)
    console.log("P2WPKH address: " + addressPair.address)
  }

  if (argv[0] === "bitshares") {
    const addressPair = getBTSAddress(argv[1])
    console.log("Private key (WIF): " + addressPair.privateKey)
    console.log("Address: " + addressPair.address)
  }
}
