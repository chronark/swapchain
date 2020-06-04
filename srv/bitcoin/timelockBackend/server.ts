import express from "express"

import HexTransaction, { HexTransactionType } from "./HexTransaction.model"
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
    await tx.save({}, (err: any, product: HexTransactionType) => {
      if (err) {
        res.status(400)
        res.json({
          success: false,
          message: err.code === 11000 ? "Duplicate entry" : err.message + ": " + err.code,
        })
      }
    })
    res.json({
      success: true,
      message: "Successfully added transaction hex to database",
    })
  },
)

export default server
