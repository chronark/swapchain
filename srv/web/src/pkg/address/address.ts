import * as bitcoin from "bitcoinjs-lib"
import { PrivateKey, key } from "bitsharesjs"
import { ChainConfig } from "bitsharesjs-ws"
import crypto from "crypto-random-string"

/**
 * An interface for a Bitcoin key/address pair
 */
export interface BTCAddress {
  privateKey: string
  publicKey: string
  address: string
}

/**
 * An interface for a Bitshares privatekey/address pair
 */
export interface BTSAddress {
  privateKey: string
  address: string
}

/**
 * A function for generating a random Bitcoin address with its corresponding private key
 *
 * @param network - A string with the requested network type.
 * @returns A BTCAddress interface with a privatekey/address pair.
 */
export function getBTCAddress(network: string): BTCAddress {
  const net = (network: string): bitcoin.Network => {
    switch (network) {
      case "mainnet":
        return bitcoin.networks.bitcoin
      case "testnet":
        return bitcoin.networks.testnet
      case "regtest":
        return bitcoin.networks.regtest
      default:
        throw new Error("Invalid network name. Choose bitcoin, testnet or regtest.")
    }
  }
  const keyPair = bitcoin.ECPair.makeRandom({ network: net(network), compressed: true })
  const privateKey = keyPair.toWIF()
  const address = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: net(network) }).address

  if (!address) {
    throw new Error("Unknown error during address generation.")
  }

  return {
    privateKey,
    publicKey: keyPair.publicKey.toString("hex"),
    address,
  }
}

/**
 * A function for generating a random Bitshares address (PublicKey) with its corresponding private key
 *
 * @param network - A string with the requested network type.
 * @returns An Address interface with a private key and address.
 */
export function getBTSAddress(network: string): BTSAddress {
  if (network === "mainnet") {
    ChainConfig.setChainId("4018d7844c78f6a6c41c6a552b898022310fc5dec06da467ee7905a8dad512c8")
  } else if (network === "testnet") {
    ChainConfig.setChainId("39f5e2ede1f8bc1a3a54a7914414e3779e33193f1f5693510e73cb7a87617447")
  } else {
    throw new Error("Invalid network name. Choose bitshares or testnet.")
  }

  const privateKey = PrivateKey.fromSeed(key.normalize_brainKey(crypto({ length: 64, type: "base64" })))
  const address = privateKey.toPublicKey().toAddressString()

  return {
    privateKey: privateKey.toWif(),
    address,
  }
}
