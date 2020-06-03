import express from "express"

const server = express()

server.use(express.json())

server.get("/", (req: express.Request, res: express.Response): void => {
  res.json({ message: "Hello World" })
})

export default server
