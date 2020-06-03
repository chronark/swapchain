import express from "express"
import { handlerHTLC } from "./routes"

const app = express()
app.use(express.json())
app.post("/htlc", handlerHTLC)

export default app
