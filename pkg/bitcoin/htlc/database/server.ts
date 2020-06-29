import  express  from "express"
import mongoose  from "mongoose"
import PostSchema, { PostschemaType } from "./model/db_schema"
import { validateLocaleAndSetLanguage } from "typescript"
import  bodyParser from 'body-parser'
require("./model/db_schema")
require("./connection")

const server = express()
server.use(express.json())

const Order = mongoose.model("PostSchema")
server.get("/hello", (req: express.Request, res: express.Response): void => {
  res.json({ message: "Hello World" })
})


server.post(
  "/orderbook",
  async (req: express.Request, res: express.Response): Promise<void> => {
    const {email, address, timelock, txFees, bidType, askType, bidAmount, expiryDate, askAmount} = req.body
    const new_post = new Order({email: email, address: address, timelock: timelock, txFees :txFees, bidType: bidType, askType:askType, bidAmount:bidAmount, expiryDate:expiryDate, askAmount:askAmount})

    try {
      await new_post.save()
    } catch {
      res.status(400)
      res.json({
        success: false,
        message: "Duplicate entry",
      })
      return
    }
    res.json({
      success: true,
      message: "Successfully added order to database",
    })
  })


export default server
