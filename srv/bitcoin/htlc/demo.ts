import BitcoinHTLC from "./btcHTLC"
import * as bitcoin from "bitcoinjs-lib"
/**
 *
 */
async function main(): Promise<void> {
  const bob = bitcoin.ECPair.fromWIF("cNaEjitvA19JZxWAFyCFMsm16TvGEmVAW3AkPnVr8E9vgwdZWMGV", bitcoin.networks.testnet)
  const joab = bitcoin.ECPair.fromWIF("cU3CS1SGfFQ5FvCHTWyo7JEBjWWEAcqMM84JJwGnQg9Deugj8Skw", bitcoin.networks.testnet)

  const h = new BitcoinHTLC()
  const hex = await h
    .getTimeLockHex(joab, bob, "bb0b2389c4861b77afc43ed27f39877a676368a9092ef57cf8a1832408c2223a".trim(), 1000, 1)
    .catch((x) => console.error(x))
  console.log(hex)
}

main()
