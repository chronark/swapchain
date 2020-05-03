import { app } from "./app"
import { AddressInfo } from "net"
export const port = 3000

/**
 * Start API and listen at port
 */
const server = app.listen(port)

/**
 * Stop API
 */
export const stopApp = () => {
  server.close()
}

export const address = server.address() as AddressInfo
