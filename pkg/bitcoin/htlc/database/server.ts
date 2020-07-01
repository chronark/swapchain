import express from "express"
import orderCollection from "./model/dbSchema"
import "./connection"
 
const server = express()
server.use(express.json())
server.use(express.urlencoded({extended: false}))
 
server.post("/orderbook", async (req: express.Request, res: express.Response): Promise<void> => {
  
  const {address, timelock, txFees, bidType, askType, bidAmount, askAmount, expiryDate} = req.body
  const NewOrder = new orderCollection(req.body)
  console.log('NewOrder:', NewOrder)
  
  try {
    await NewOrder.save()
  } catch(error) {
    res.status(400)
    res.json({
      success: false,
      message: "Order could not be saved"
    })
    return
  }
    res.json({
      success: true,
      message: "Successfully added order to database"
    })
    })

export default server