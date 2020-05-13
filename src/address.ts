import * as bitcoin from "bitcoinjs-lib"

/**
 * An interface for a privatekey/address pair
 */
export interface BTCAddress {
  privateKey: string
  address: string
}

/**
 * A function for generating a random Bitcoin address with its corresponding private key
 *
 * @param network A string with the requested network type
 * @returns A BTCAddress interface with a privatekey/address pair
 */
export function getBTCAddress(network: string): BTCAddress {
  const net = (network: string): bitcoin.Network => {
    switch (network) {
      case "bitcoin":
        return bitcoin.networks.bitcoin
      case "testnet":
        return bitcoin.networks.testnet
      case "regtest":
        return bitcoin.networks.regtest
      default:
        throw new Error("Invalid network name. Choose bitcoin, testnet or regtest.")
    }
  }
  const keyPair = bitcoin.ECPair.makeRandom({ network: net(network) })

  const privateKey = keyPair.toWIF()
  const address = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: net(network) }).address

  if (!address) {
    throw new Error("Unknown error during address generation.")
  }

  return {
    privateKey,
    address,
  }
}
