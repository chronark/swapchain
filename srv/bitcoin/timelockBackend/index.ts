import server from "./server"
import mongoose from "mongoose"
import { Reaper } from "./reaper"
const port = process.env.PORT || 3000
const mongoPort = process.env.MONGO_PORT || 27017
const dbName = process.env.DB_NAME || "test"

mongoose
  .connect(`mongodb://mongo:${mongoPort}/${dbName}`, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB connected")
    server.listen(port, () => {
      console.log(`Listening on ${port}`)
    })
    new Reaper(10, "testnet").run()
  })
