import express from "express"
export const app = express()

app.use(express.json())

/**
 * API endpoint listening for http POST JSON messages
 *
 * @returns JSON message
 */
app.post("/", (req: express.Request, res: express.Response) => {
  return res.json(req.body)
})
