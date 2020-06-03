import server from "./server"
import supertest from "supertest"

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
    it("should reply to POST with 400 if the request is not valid", async () => {
        const response = await supertest(server).post("/timelocks")
        expect(response.status).toBe(400)
        expect(response.body).toBe("Missing keys: `hex` or `validAfterBlockheight`")

      })
      it("should reply to POST with 200 if the request is valid", async () => {
        const response = await supertest(server).post("/timelocks").send({ hex: "02000000SOMETHING", validAfterBlockHeight: 1 })
        expect(response.status).toBe(200)
        expect(response.body).toBe("Successfully added transaction hex to database")
      })
    })
  