import supertest from "supertest"
import app from "./app"
import fetch from "node-fetch"
import { mocked } from "ts-jest/utils"

jest.mock("node-fetch", () => {
  return jest.fn()
})

const req = supertest(app)

describe("Test the API endpoint", () => {
  it("should reply to GET with 404", async () => {
    const response = await req.get("/")
    expect(response.status).toBe(404)
  })

  it("should reply to POST with 200 and return capitalized json message", async () => {
    mocked(fetch).mockImplementation(
      (): Promise<any> => {
        return Promise.resolve({
          json() {
            return Promise.resolve(JSON.stringify({ capitalizedText: "HELLO" }))
          },
        })
      },
    )

    const response = await req.post("/").send({ text: "hello" }).set("Accept", "application/json")

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(response.status).toBe(200)
    expect(response.body).toEqual(JSON.stringify({ capitalizedText: "HELLO" }))
  })
})