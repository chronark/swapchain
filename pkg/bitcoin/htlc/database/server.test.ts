import server from "./server"
import supertest from "supertest"
import OrderCollection from "./model/dbSchema"

jest.mock("./model/dbSchema")

beforeEach(() => {
  jest.resetAllMocks()
})

describe("Test if orders are sent to our database and respectively saved", () => {
  it("should reply to POST with 400 if it fails to send orders to the database", async () => {
    OrderCollection.prototype.save = jest.fn().mockImplementation(async () => {
      throw new Error()
    })
    const response = await supertest(server).post("/orderbook").send({
      address: "0123456789",
      timelock: 5,
      txFees: 5000,
      bidType: "BTC",
      askType: "BTS",
      bidAmount: 1,
      askAmount: 10000,
      expiryDate: "01/09/2020",
    })
    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe("Order could not be saved")
  })

  it("should reply to POST with 200 if the request is valid", async () => {
    OrderCollection.prototype.save = jest.fn().mockImplementation(() => {})

    const body = {
      address: "0123456789",
      timelock: 5,
      txFees: 5000,
      bidType: "BTC",
      askType: "BTS",
      bidAmount: 1,
      askAmount: 10000,
      expiryDate: "01/09/2020",
    }

    const response = await supertest(server).post("/orderbook").send(body)
    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toBe("Successfully added order to database")

    expect(OrderCollection).toBeCalledWith(body)
  })
})
