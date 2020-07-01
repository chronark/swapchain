import server from "./server"
import mongoose from "mongoose"
require("dotenv").config({ path: ".env" })

const port = process.env.PORT || 8080
const mongoPort = process.env.MONGO_PORT || 27017
const dbName = process.env.DB_NAME || "test"
const URI = process.env.MONGOURI

mongoose.connect(URI!, { useUnifiedTopology: true, useNewUrlParser: true }).then(() => {
  console.log("MongoDB connected")
  server.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
})
