import { port, stopApp, address } from "./index"

describe("Test the API is running", () => {
  test("It is listening on given port", async () => {
    expect(address.port).toEqual(port)
    stopApp()
  })
})
