import express from "express"
import { toUpper } from "./routes"

const app = express()
app.use(express.json())
app.post("/upper", toUpper)

export default app
