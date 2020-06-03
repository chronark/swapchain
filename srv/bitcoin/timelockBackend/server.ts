import express from "express"

import HexTransaction from "./HexTransaction.model"
import { validateLocaleAndSetLanguage } from "typescript"

const server = express()

server.use(express.json())

server.get("/", (req: express.Request, res: express.Response): void => {
  res.json({ message: "Hello World" })
})

server.post(
  "/timelocks",
  async (req: express.Request, res: express.Response): Promise<void> => {
    const { hex, validAfterBlockHeight } = req.body
    if (typeof hex === "undefined" || hex === "") {
      res.status(400)
      res.json({ success: false, message: "Missing hex" })
      return
    }
    if (typeof validAfterBlockHeight === "undefined" || validAfterBlockHeight === "") {
      res.status(400)
      res.json({ success: false, message: "Missing validAfterBlockHeight" })
      return
    }

    const tx = new HexTransaction({ hex: hex, validAfterBlockHeight: validAfterBlockHeight })
    await tx.save()

    res.json({
      success: true,
      message: "Successfully added transaction hex to database",
    })
  },
)

export default server
