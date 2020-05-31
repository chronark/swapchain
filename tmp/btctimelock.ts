import * as bitcoin from "bitcoinjs-lib"
import { RegtestUtils } from "regtest-client"
import { PsbtInput } from "bip174/src/lib/interfaces"
import bip68 from "bip68"
import varuint from "varuint-bitcoin"
const regtest = bitcoin.networks.regtest

const APIPASS = process.env.APIPASS || "satoshi"
const APIURL = process.env.APIURL || "https://regtest.bitbank.cc/1"

const regtestUtils = new RegtestUtils({ APIPASS, APIURL })

const alice = bitcoin.ECPair.fromWIF("cQBwuzEBYQrbWKFZZFpgitRpdDDxUrT1nzvhDWhxMmFtWdRnrCSm", regtest)
const bob = bitcoin.ECPair.fromWIF("cNaEjitvA19JZxWAFyCFMsm16TvGEmVAW3AkPnVr8E9vgwdZWMGV", regtest)

// This function is used to finalize a CSV transaction using PSBT.
// See first test above.
/**
 * @param inputIndex
 * @param input
 * @param script
 * @param isSegwit
 * @param isP2SH
 * @param isP2WSH
 */
function csvGetFinalScripts(
  inputIndex: number,
  input: PsbtInput,
  script: Buffer,
  isSegwit: boolean,
  isP2SH: boolean,
  isP2WSH: boolean,
): {
  finalScriptSig: Buffer | undefined
  finalScriptWitness: Buffer | undefined
} {
  // Step 1: Check to make sure the meaningful script matches what you expect.
  const decompiled = bitcoin.script.decompile(script)
  // Checking if first OP is OP_IF... should do better check in production!
  // You may even want to check the public keys in the script against a
  // whitelist depending on the circumstances!!!
  // You also want to check the contents of the input to see if you have enough
  // info to actually construct the scriptSig and Witnesses.
  if (!decompiled || decompiled[0] !== bitcoin.opcodes.OP_IF) {
    throw new Error(`Can not finalize input #${inputIndex}`)
  }

  // Step 2: Create final scripts
  let payment: bitcoin.Payment = {
    network: regtest,
    output: script,
    // This logic should be more strict and make sure the pubkeys in the
    // meaningful script are the ones signing in the PSBT etc.
    input: bitcoin.script.compile([input.partialSig![0].signature, bitcoin.opcodes.OP_TRUE]),
  }
  if (isP2WSH && isSegwit)
    payment = bitcoin.payments.p2wsh({
      network: regtest,
      redeem: payment,
    })
  if (isP2SH)
    payment = bitcoin.payments.p2sh({
      network: regtest,
      redeem: payment,
    })

  /**
   * @param witness
   */
  function witnessStackToScriptWitness(witness: Buffer[]): Buffer {
    let buffer = Buffer.allocUnsafe(0)

    /**
     * @param slice
     */
    function writeSlice(slice: Buffer): void {
      buffer = Buffer.concat([buffer, Buffer.from(slice)])
    }

    /**
     * @param i
     */
    function writeVarInt(i: number): void {
      const currentLen = buffer.length
      const varintLen = varuint.encodingLength(i)

      buffer = Buffer.concat([buffer, Buffer.allocUnsafe(varintLen)])
      varuint.encode(i, buffer, currentLen)
    }

    /**
     * @param slice
     */
    function writeVarSlice(slice: Buffer): void {
      writeVarInt(slice.length)
      writeSlice(slice)
    }

    /**
     * @param vector
     */
    function writeVector(vector: Buffer[]): void {
      writeVarInt(vector.length)
      vector.forEach(writeVarSlice)
    }

    writeVector(witness)

    return buffer
  }

  return {
    finalScriptSig: payment.input,
    finalScriptWitness:
      payment.witness && payment.witness.length > 0 ? witnessStackToScriptWitness(payment.witness) : undefined,
  }
}

/**
 * @param address
 */
function toOutputScript(address: string): Buffer {
  return bitcoin.address.toOutputScript(address, regtest)
}

/**
 * @param txid
 */
function idToHash(txid: string): Buffer {
  return Buffer.from(txid, "hex").reverse()
}

const hashType = bitcoin.Transaction.SIGHASH_ALL

interface KeyPair {
  publicKey: Buffer
}

// IF MTP (from when confirmed) > seconds, _alice can redeem
/**
 * @param _alice
 * @param _bob
 * @param sequence
 */
function csvCheckSigOutput(_alice: KeyPair, _bob: KeyPair, sequence: number): Buffer {
  return bitcoin.script.fromASM(
    `
    OP_IF
        ${bitcoin.script.number.encode(sequence).toString("hex")}
        OP_CHECKSEQUENCEVERIFY
        OP_DROP
    OP_ELSE
        ${_bob.publicKey.toString("hex")}
        OP_CHECKSIGVERIFY
    OP_ENDIF
    ${_alice.publicKey.toString("hex")}
    OP_CHECKSIG
  `
      .trim()
      .replace(/\s+/g, " "),
  )
}

// 2 of 3 multisig of _bob, _charles, _dave,
// but after sequence1 time, _alice can allow the multisig to become 1 of 3.
// but after sequence2 time, _alice can sign for the output all by themself.

/* tslint:disable-next-line */
// Ref: https://github.com/bitcoinbook/bitcoinbook/blob/f8b883dcd4e3d1b9adf40fed59b7e898fbd9241f/ch07.asciidoc#complex-script-example

// Note: bitcoinjs-lib will not offer specific support for problems with
//       advanced script usages such as below. Use at your own risk.
/**
 * @param _alice
 * @param _bob
 * @param _charles
 * @param _dave
 * @param sequence1
 * @param sequence2
 */
function complexCsvOutput(
  _alice: KeyPair,
  _bob: KeyPair,
  _charles: KeyPair,
  _dave: KeyPair,
  sequence1: number,
  sequence2: number,
): Buffer {
  return bitcoin.script.fromASM(
    `
      OP_IF
          OP_IF
              OP_2
          OP_ELSE
              ${bitcoin.script.number.encode(sequence1).toString("hex")}
              OP_CHECKSEQUENCEVERIFY
              OP_DROP
              ${_alice.publicKey.toString("hex")}
              OP_CHECKSIGVERIFY
              OP_1
          OP_ENDIF
          ${_bob.publicKey.toString("hex")}
          ${_charles.publicKey.toString("hex")}
          ${_dave.publicKey.toString("hex")}
          OP_3
          OP_CHECKMULTISIG
      OP_ELSE
          ${bitcoin.script.number.encode(sequence2).toString("hex")}
          OP_CHECKSEQUENCEVERIFY
          OP_DROP
          ${_alice.publicKey.toString("hex")}
          OP_CHECKSIG
      OP_ENDIF
    `
      .trim()
      .replace(/\s+/g, " "),
  )
}

/**
 *
 */
async function simple() {
  const sequence = bip68.encode({ blocks: 5 })
  const p2sh = bitcoin.payments.p2sh({
    redeem: {
      output: csvCheckSigOutput(alice, bob, sequence),
    },
    network: regtest,
  })

  const unspent = await regtestUtils.faucet(p2sh.address!, 1e5)
  const utx = await regtestUtils.fetch(unspent.txId)

  const nonWitnessUtxo = Buffer.from(utx.txHex, "hex")

  const tx = new bitcoin.Psbt({ network: regtest })
    .setVersion(2)
    .addInput({
      hash: unspent.txId,
      index: unspent.vout,
      sequence,
      redeemScript: p2sh.redeem!.output!,
      nonWitnessUtxo,
    })
    .addOutput({
      address: regtestUtils.RANDOM_ADDRESS,
      value: 7e4,
    })
    .signInput(0, alice)
    .finalizeInput(0, csvGetFinalScripts) // See csvGetFinalScripts below
    .extractTransaction()

  await regtestUtils.mine(10)
  await regtestUtils.broadcast(tx.toHex())
  await regtestUtils.verify({
    txId: tx.getId(),
    address: regtestUtils.RANDOM_ADDRESS,
    vout: 0,
    value: 7e4,
  })

  console.log(tx)
}

simple()
