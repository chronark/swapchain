import fetch from "node-fetch"
import { handler } from "./routes"
import express from "express"
import { mocked } from "ts-jest/utils"
jest.mock("node-fetch", () => jest.fn())

describe("Test the API endpoint", () => {
  it("should reply to POST with 200 and return capitalized json message", async () => {
    mocked(fetch).mockImplementation(
      (): Promise<any> => {
        return Promise.resolve({
          status: 200,
          json() {
            return Promise.resolve(JSON.stringify({ capitalizedText: "HELLO WORLD" }))
          },
        })
      },
    )

    const mockExpressReq = (): express.Request => {
      const req: express.Request = express.request
      req.body = JSON.stringify({ text: "hello world" })
      return req
    }

    const mockExpressRes = (): express.Response => {
      const res: express.Response = express.response

      res.status = jest.fn().mockImplementation((code: number): express.Response => res)

      res.json = jest.fn().mockImplementation((body?: any): express.Response => res)
      return res
    }

    const response = mockExpressRes()

    await handler(mockExpressReq(), response)

    expect(fetch).toHaveBeenCalledTimes(1)

    expect(response.status).toHaveBeenCalledTimes(1)
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledTimes(1)
    expect(response.json).toHaveBeenCalledWith(JSON.stringify({ capitalizedText: "HELLO WORLD" }))
  })
})
