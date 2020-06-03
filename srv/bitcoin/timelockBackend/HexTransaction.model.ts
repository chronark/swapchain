import mongoose, { Schema, Document } from "mongoose"

export interface HexTransaction extends Document {
  hex: string
  validAfterBlockHeight: number
}

const hexTransactionSchema = new Schema({
  hex: {
    type: String,
    required: true,
    unique: true,
  },
  validAfterBlockHeight: {
    // A transaction may be valid after the block height is greater than the block height at creation + sequence
    type: Number,
    required: true,
  },
})

export default mongoose.model<HexTransaction>("HexTransaction", hexTransactionSchema)
