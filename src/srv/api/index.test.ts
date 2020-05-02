import supertest from "supertest"
import { app } from "./index"
const req = supertest(app)
const jsonData = {
  asset1: "BTC",
  asset2: "BTS",
}

describe("Test the API endpoint", () => {
  test("It should reply to GET with 404", async () => {
    const response = await req.get("/")
    expect(response.status).toBe(404)
  })

  test("It should reply to POST with 200 and sent json message", async () => {
    const response = await req.post("/").send(jsonData).set("Accept", "application/json")
    expect(response.status).toBe(200)
    expect(response.body).toEqual(jsonData)
  })
})
