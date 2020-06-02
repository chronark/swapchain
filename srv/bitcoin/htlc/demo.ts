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
  const alicesLastTransactionID = "be3af89b2ab1f46a81766b7f768ca935201287278e5cc997e9875813fa44855a"

  const htlc = new BitcoinHTLC()
  const hex = await htlc.getTimeLockHex(alice, bob, alicesLastTransactionID, 1_000, 5)
  console.log({ hex })
}

/**
 * Create a new timelock from charles's address to be opened after 10 blocks
 * I created this last night.
 */
async function charlesToBobRefundable(): Promise<void> {
  const charlesLastTransactionID = "7b24f337dad525b8be03bd405839c3e014bcfbc635604fa594ef391c1fb2f96d"

  const htlc = new BitcoinHTLC()
  const hex = await htlc.getTimeLockHex(charles, bob, charlesLastTransactionID, 1_000, 10)
  console.log({ hex })
  // 0200000001b85ae0ae4d5b6f758fcfa40b4a58231fdc7cfc786bfcf30ec21e31e6ee8fe50401000000d747304402205fe170afd9965e2350253a56d9fa5cf81a31d5f37c25a9b97596c26c40d965290220433c86f910e6fef51d2754a3bffad240878714d1a6243366a5a3c962e5031c3c01514c8c635ab275674104ddb9df64974a58e41814c1b04caf727016c66c21a71d96b8877d4c836784cd0306dccc9a0cb62370829edc065403fcd01ab33a0a269cd862b00ad362f6c4130dad684104fda7f9a15397d0a2a493853848170f9370d734b0a4b3c065db6524871b66732b49467e24e92b081183a20d64d543787cc5bfae14b13eac8312ce4975a41d9c94ac0a00000001e8030000000000001976a914b03c0fbccac0a2c8da14e6c47e6f3e13c539d78788ac00000000
}

/*
  Steps:
  1. Generate p2sh address
  2. Create transaction to send funds to p2sh address
  3. Broadcast transaction
  4. Create time-locked transaction with the previous funds
  5. Wait for n blocks and broadcast it to refund if bob has never claimed the funds
*/
