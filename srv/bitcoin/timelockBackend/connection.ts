import mongoose from "mongoose"
import { HexTransaction } from "./HexTransaction.model"

/**
 * Create a connection to the dockerized database instance.
 */
export async function connect(): Promise<mongoose.Mongoose> {
  return mongoose.connect("mongodb://mongo:27017/mongo-test")
}
