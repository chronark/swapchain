import * as bitcoin from "bitcoinjs-lib"

export interface BTCAddress {
  privateKey: string
  address: string
}

/**
 * @param network
 */
export function getBTCAddress(network: string): BTCAddress {
  const net = (network: string): bitcoin.networks.Network => {
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
