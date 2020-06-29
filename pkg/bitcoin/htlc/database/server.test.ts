import server from "./server"
import supertest from "supertest"
import mongoose, { Mongoose } from "mongoose"
import PostSchema from "./model/db_schema"


describe("Test API Endpoint /", () => {
    it("should reply to GET with default message", async () => {
      const response = await supertest(server).get("/")
      expect(response.status).toBe(200)
      expect(response.body).toEqual({ message: "Hello World" })
    })
  })

  it("should reply to POST with 400 if the transactionHex is already in the database", async () => {
    PostSchema.prototype.save = jest.fn().mockImplementation(async () => {
      throw new Error()
    })
    const response = await supertest(server)
      .post("/orderbook")
      .send({ email: "swapchain@gmail.com", address: "1234566789", timelock:"5", txFees:5000, bidType: "BTC", askType:"BTS", bidAmount: 1000, expiryDate: "23/07/2020", askAmount:50000})
    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe("Duplicate entry")
  })

  it("should reply to POST with 200 if the request is valid", async () => {
    PostSchema.prototype.save = jest.fn().mockImplementation(() => {})

    const payload = { email: "swapchain@gmail.com", address: "1234566789", timelock:"5", txFees:5000, bidType: "BTC", askType:"BTS", bidAmount: 1000, expiryDate: "23/07/2020", askAmount:50000}

    const response = await supertest(server).post("/orderbook").send(payload)
    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toBe("Successfully added sample data to database")
    expect(PostSchema).toBeCalledWith(payload)
  })
