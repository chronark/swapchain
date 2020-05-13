import server from "./server"
const port = process.env.PORT || 3000

console.log(`app is running on port :${port}`)
server.listen(port)
