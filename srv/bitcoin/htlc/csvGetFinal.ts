/* eslint-disable jsdoc/require-param-description */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import * as bitcoin from "bitcoinjs-lib"
import { PsbtInput } from "bip174/src/lib/interfaces"
import varuint from "varuint-bitcoin"
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
export function csvGetFinalScripts(
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
    network: bitcoin.networks.testnet,
    output: script,
    // This logic should be more strict and make sure the pubkeys in the
    // meaningful script are the ones signing in the PSBT etc.
    input: bitcoin.script.compile([input.partialSig![0].signature, bitcoin.opcodes.OP_TRUE]),
  }
  if (isP2WSH && isSegwit)
    payment = bitcoin.payments.p2wsh({
      network: bitcoin.networks.testnet,
      redeem: payment,
    })
  if (isP2SH)
    payment = bitcoin.payments.p2sh({
      network: bitcoin.networks.testnet,
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
