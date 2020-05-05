import { handler } from "./routes"
import { mockFetch } from "../../mocks/mockFetch"
import { mockExpress } from "../../mocks/mockExpress"
import fetch from "node-fetch"

jest.mock("node-fetch", () => jest.fn())

beforeEach(() => {
  jest.resetAllMocks()
})

describe("Test the API handler", () => {
  const testCases = [
    {
      name: "should reply to POST with 400 and return error message",
      input: { text: "" },
      want: {
        status: 400,
        body: JSON.stringify({ error: "HELLO WORLD" }),
      },
    },
    {
      name: "should reply to POST with 200 and return capitalized json message",
      input: { text: "hello not world" },
      want: {
        status: 200,
        body: JSON.stringify({ capitalizedText: "HELLO WORLD" }),
      },
    },
  ]

  testCases.forEach((tc) => {
    it(tc.name, async () => {
      jest.resetAllMocks()
      mockFetch(tc.want.status, tc.want.body)

      const { req, res } = mockExpress(tc.input)
      await handler(req, res)

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith("http://swapchain-srv-toupper:3000/upper", {
        body: JSON.stringify(tc.input),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      })

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(tc.want.status)

      expect(res.json).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledWith(tc.want.body)
    })
  })
})
