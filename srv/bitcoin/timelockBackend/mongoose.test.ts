import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import HexTransactionModel, { HexTransactionType } from "./HexTransaction.model"

const mongod = new MongoMemoryServer()
const connect = async (): Promise<void> => {
  const uri = await mongod.getConnectionString()
  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
  await mongoose.connect(uri, mongooseOpts)
}

const closeDB = async (): Promise<void> => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongod.stop()
}

const clearDatabase = async (): Promise<void> => {
  const collections = mongoose.connection.collections

  for (const key in collections) {
    const collection = collections[key]
    await collection.deleteMany({})
  }
}

beforeAll(async () => {
  await connect()
})

afterEach(async () => {
  await clearDatabase()
})

afterAll(async () => {
  await closeDB()
})

describe("HexTransaction", () => {
  it("returns only the entries where the block height is greater", async () => {
    for (let i = 0; i < 10; i++) {
      await new HexTransactionModel({ hex: "asdf" + i.toString(), validAfterBlockHeight: i }).save()
    }
    const currentBlockHeight = 5
    const validTransactions = await HexTransactionModel.find({
      validAfterBlockHeight: {
        $lte: currentBlockHeight,
      },
    })

    expect(validTransactions.length).toBe(6)
  })

  it("deletes an entry by id", async () => {
    for (let i = 0; i < 10; i++) {
      await new HexTransactionModel({ hex: "asdf" + i.toString(), validAfterBlockHeight: i }).save()
    }
    const tx = await HexTransactionModel.findOne({
      validAfterBlockHeight: 2,
    })

    await HexTransactionModel.deleteOne({ _id: tx?._id })

    expect(await HexTransactionModel.findOne({ _id: tx?._id })).toBeNull()
    expect((await HexTransactionModel.find()).length).toBe(9)
  })

  it("creates and saves a HexTransaction successfully", async () => {
    const incomingHexTransaction = {
      hex:
        "02000000015a8544fa135887e997c95ca8e2787122035a98c767f6b76816af4b12a9bf83abe01000000d8483045022100a3c3e825968fc25cae2153b3aec1a7050527db168cc0341eb0d54a6e8545b4d1022002abc4d0bb501a0bcb88f454d138451f1e3b182c25416fd78f305e02c8f7f46501514c8c6355b275674104ddb9df64a974a58e41814c1b04caf727016c66c21a71d96b8877d4c836784cd0306dccc9a0cb62370829edc065403fcd01ab33a0a269cd862b00ad362f6c4130dad6841045ef83ee7f6fdcf75ef5c253388188ea71df19b09f9936dbe77d88544034d1acbbc59eb5a3883c03ee988e417cf0dd1e28b5752a9a32f34cab3bb67c8687b8bf7ac0500000001e8030000000000001976a914b03c0fbccac0a2c8da14e6c47e6f3e13c539d78788ac00000000",
      validAfterBlockHeight: 1,
    }
    const validHexTransaction = new HexTransactionModel(incomingHexTransaction)
    const savedHexTransaction = await validHexTransaction.save()

    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedHexTransaction._id).toBeDefined()
    expect(savedHexTransaction.hex).toBe(incomingHexTransaction.hex)
    expect(savedHexTransaction.validAfterBlockHeight).toBe(incomingHexTransaction.validAfterBlockHeight)

    expect((await HexTransactionModel.find()).length).toBe(1)
  })
})
