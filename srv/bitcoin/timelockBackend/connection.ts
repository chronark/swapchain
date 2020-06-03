import mongoose from "mongoose"
import {HexTransaction} from "./HexTransaction.model"

export async function connect(): Promise<mongoose.Mongoose> {
    return mongoose.connect("mongodb://mongo:27017/mongo-test")
}