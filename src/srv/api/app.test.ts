import app from "./app"
import supertest from "supertest"
import { mocked } from "ts-jest/utils"
import { handler } from "./routes"
jest.mock("./routes")

const request = supertest(app)

describe("Test API Endpoint /", () => {
  it("should reply to GET with 404", async () => {
    const response = await request.get("/")
    expect(response.status).toBe(404)
  })
  it("should call handler and process json message", async () => {
    mocked(handler).mockImplementation(
      async (req, res): Promise<void> => {
        res.json(req.body)
      },
    )
    const response = await request.post("/").send({ text: "Hello World" })
    expect(handler).toHaveBeenCalledTimes(1)
    expect(response.body).toEqual({ text: "Hello World" })
  })
})
