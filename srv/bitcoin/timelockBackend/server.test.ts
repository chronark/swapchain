import server from "./server"
import supertest from "supertest"

describe("Test API Endpoint /", () => {
  it("should reply to GET with default message", async () => {
    const response = await supertest(server).get("/")
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ message: "Hello World" })
  })
})
