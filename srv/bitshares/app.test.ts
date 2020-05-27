import app from "./app"
import supertest from "supertest"
import { mocked } from "ts-jest/utils"
import { handlerHTLC } from "./routes"
jest.mock("./routes")

const request = supertest(app)

describe("Test API Endpoint /htlc", () => {
  it("should reply to GET with 404", async () => {
    const response = await request.get("/htlc")
    expect(response.status).toBe(404)
  })
  it("should call handler and process json message", async () => {
    mocked(handlerHTLC).mockImplementation(
      async (req, res): Promise<void> => {
        res.json(req.body)
      },
    )
    const response = await request.post("/htlc").send({ method: "htlc_create" })
    expect(handlerHTLC).toHaveBeenCalledTimes(1)
    expect(response.body).toEqual({ method: "htlc_create" })
  })
})
