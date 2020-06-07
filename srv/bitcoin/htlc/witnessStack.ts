/* eslint-disable jsdoc/require-param-description */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import varuint from "varuint-bitcoin"

/**
 * Helperfunction to serialize the final witness script
 *
 * @param witness
 */
export function witnessStackToScriptWitness(witness: Buffer[]): Buffer {
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
