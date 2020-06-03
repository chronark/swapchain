import server from "./server"
import { connect } from "./connection"
const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(`Listening on ${port}`)
})

connect().then(() => {
    console.log("MongoDb connected")
})