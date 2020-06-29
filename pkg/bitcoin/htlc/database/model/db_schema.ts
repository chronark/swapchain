import mongoose, { Schema, Document } from "mongoose"



export interface PostschemaType extends Document {
    email: String, 
    address: String,
    timelock: Number,
    txFees: Number,
    bidType: String,
    askType: String,
    bidAmount: Number,
    expiryDate: String,
    askAmount: Number
  }


const post_schema = new Schema({
    email:  {
        type: String,
        required: true
    }, 
    address: {
        type: String,
        required: true
    },
    timelock: {
        type: Number,
        required: true
    },
    txFees:  {
        type: Number,
        required: true
    },
    bidType:  {
        type: String,
        required: true
    },
    askType:  {
        type: String,
        required: true
    },
    bidAmount:  {
        type: Number,
        required: true
    },
    expiryDate:  {
        type: String,
        required: true
    },
    askAmount:  {
        type: Number,
        required: true
    }
})


export default mongoose.model<PostschemaType>("PostSchema", post_schema)