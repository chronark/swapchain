import BitcoinHTLC from "./btcHTLC"
import * as bitcoin from "bitcoinjs-lib"

const wallets = {
  alice: {
    pub: "mghk4cEDJgFeexooFH7YbwoQL5ZLJZ2ikE",
    prv: "92fiE9fDghnGbMUpozbyEzP31iLEDxATERy1Ka3nti24cWmVMfH",
  },
  bob: {
    pub: "mwaoAxfepANyvucy7pGZs9UpCjpXiTqHen",
    prv: "92aW1TxHmcnH8ainb6oghkhn8i4J7zRCkbLXjqPnChZCP4zcpcD",
  },
  charles: {
    pub: "mrH9p4wcZUWrHoYJ8QSkALLui6AWV1tQSi",
    prv: "92G1q9SoS3otJK2MX9ttPm8V6peagUR94zPs4qVS2nMcSp2DXhX",
  },
}

const NETWORK = bitcoin.networks.testnet

const alice = bitcoin.ECPair.fromWIF(wallets.alice.prv, NETWORK)
const bob = bitcoin.ECPair.fromWIF(wallets.bob.prv, NETWORK)
const charles = bitcoin.ECPair.fromWIF(wallets.charles.prv, NETWORK)

/**
 * Create a new timelock from alice's address to be opened after 5 blocks
 */
async function aliceToBob(): Promise<void> {
  const alicesLastTransactionID = ""

  const htlc = new BitcoinHTLC()
  const hex = await htlc.getTimeLockHex(alice, bob, alicesLastTransactionID, 1_000, 5)
  console.log({ hex })
}

/**
 * Create a new timelock from charles's address to be opened after 10 blocks
 * I created this last night.
 */
async function charlesToBobRefundable(): Promise<void> {
  const charlesLastTransactionID = ""

  const htlc = new BitcoinHTLC()
  const hex = await htlc.getTimeLockHex(charles, bob, charlesLastTransactionID, 1_000, 10)
}

/*
  Steps:
  1. Generate p2sh address
  2. Create transaction to send funds to p2sh address
  3. Broadcast transaction
  4. Create time-locked transaction with the previous funds
  5. Wait for n blocks and broadcast it to refund if bob has never claimed the funds
*/
