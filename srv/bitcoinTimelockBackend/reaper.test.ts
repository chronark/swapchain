import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import HexTransactionModel, { HexTransactionType } from "./HexTransaction.model"
import Reaper from "./reaper"
import { BlockStream } from "../web/src/pkg/bitcoin/api/blockstream"
// jest.mock("../../pkg/bitcoin/api/blockstream")
console.log = jest.fn()

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
  // fetchMock.get("begin:https://api.blockcypher.com/v1/btc/test3", {
  //   height: 54,
  // })

  // fetchMock.post("https://testnet-api.smartbit.com.au/v1/blockchain/pushtx", {
  //   success: true,
  //   txid: "IAmAReallyCoolTransactionID",
  // })
})

beforeEach(async () => {
  for (let i = 0; i < 100; i++) {
    await new HexTransactionModel({ hex: "IAmAHex" + i.toString(), validAfterBlockHeight: i }).save()
  }
})
afterEach(async () => {
  await clearDatabase()
})

afterAll(async () => {
  await closeDB()
})

describe("Reaper", () => {
  it("should redeem all valid transactions", async () => {
    const pushMock = jest.spyOn(BlockStream.prototype, "pushTX").mockReturnValue(Promise.resolve("Hello Amos"))
    const getMock = jest
      .spyOn(BlockStream.prototype, "getLastBlock")
      .mockReturnValue(Promise.resolve({ height: 54, timestamp: 1 }))

    const r = new Reaper("testnet", BlockStream)
    await r.redeemAllValid()

    expect((await HexTransactionModel.find()).length).toBe(45)

    expect(pushMock).toBeCalledTimes(55)
    expect(getMock).toBeCalledTimes(1)
  })
})
