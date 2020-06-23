import BitcoinHTLC from "./btcHTLC"
import * as bitcoin from "bitcoinjs-lib"
import { getSecret } from "../../secret/secret"

const network = bitcoin.networks.testnet
const secret = {
  preimage: "YaCIobSn/S3r0HXspEWAEIETyxabQ5A4",
  hash: bitcoin.crypto.sha256(Buffer.from("YaCIobSn/S3r0HXspEWAEIETyxabQ5A4")),
}

const alice = bitcoin.ECPair.fromWIF("", network)

const p2wpkhAlice = bitcoin.payments.p2wpkh({ pubkey: alice.publicKey, network })
console.log(p2wpkhAlice.address)

const bob = bitcoin.ECPair.fromWIF("", network)

const bobCompressed = bitcoin.ECPair.fromPrivateKey(bob.privateKey!, { compressed: true })
const aliceCompressed = bitcoin.ECPair.fromPrivateKey(alice.privateKey!, { compressed: true })

const htlc = new BitcoinHTLC(1_000, network, secret, 1, aliceCompressed, bobCompressed, 99_000)

htlc.create("")
