import express from "express"
import { handler } from "./routes"

const app = express()
app.use(express.json())

/**
 * API endpoint listening for http POST JSON messages
 */
app.post("/", handler)

export default app
