import server from "./server"
import supertest from "supertest"
import mongoose, { Mongoose } from "mongoose"
import HexTransaction from "./HexTransaction.model"

jest.mock("./HexTransaction.model")

beforeEach(() => {
  jest.resetAllMocks()
})

describe("Test API Endpoint /", () => {
  it("should reply to GET with default message", async () => {
    const response = await supertest(server).get("/")
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ message: "Hello World" })
  })
})

describe("Test API Endpoint /timelocks", () => {
  it("should reply to GET with 404", async () => {
    const response = await supertest(server).get("/timelocks")
    expect(response.status).toBe(404)
  })

  it("should reply to POST with 400 if the request is missing the `hex` key", async () => {
    const response = await supertest(server).post("/timelocks").send({ validAfterBlockHeight: 1 })
    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe("Missing hex")
  })
  it("should reply to POST with 400 if the request is missing the `validAfterBlockHeight` key", async () => {
    const response = await supertest(server).post("/timelocks").send({ hex: "02000000SOMETHING" })
    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe("Missing validAfterBlockHeight")
  })
  it("should reply to POST with 400 if the request is missing both keys", async () => {
    const response = await supertest(server).post("/timelocks")
    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe("Missing hex")
  })

  it("should reply to POST with 400 if the transactionHex is already in the database", async () => {
    const response = await supertest(server).post("/timelocks")
    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe("Missing hex")
  })

  it("should reply to POST with 200 if the request is valid", async () => {
    HexTransaction.prototype.save = jest.fn().mockImplementation(() => {})

    const payload = { hex: "02000000SOMETHING", validAfterBlockHeight: 1 }

    const response = await supertest(server).post("/timelocks").send(payload)
    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toBe("Successfully added transaction hex to database")

    expect(HexTransaction).toBeCalledWith(payload)
  })
})
