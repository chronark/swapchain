import server from "./server"
import Reaper from "./reaper"
import mongoose from "mongoose"
import { CronJob } from "cron"
import { BlockStream } from "../web/src/pkg/bitcoin/api/blockstream"

const port = process.env.PORT || 3000
const mongoPort = process.env.MONGO_PORT || 27017
const dbName = process.env.DB_NAME || "test"

const reaper = new Reaper("testnet", BlockStream)

const cronJob = new CronJob(
  "*/10 * * * *",
  () => {
    reaper.redeemAllValid()
  },
  null,
  true,
  "America/Los_Angeles",
)
cronJob.start()

mongoose
  .connect(`mongodb://mongo:${mongoPort}/${dbName}`, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB connected")
    server.listen(port, () => {
      console.log(`Listening on ${port}`)
    })
  })
