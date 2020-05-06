import server from "./server"
import supertest from "supertest"

const request = supertest(server)
describe("Endpoint /upper", () => {
  describe("successfully transforms to upper case", () => {
    const testCases = [
      {
        name: "only lower case",
        in: "hello world",
        want: "HELLO WORLD",
      },
      {
        name: "mixed case",
        in: "Hello World",
        want: "HELLO WORLD",
      },
      {
        name: "upper case",
        in: "HELLO WORLD",
        want: "HELLO WORLD",
      },
      {
        name: "numbers",
        in: "He11o World",
        want: "HE11O WORLD",
      },
    ]
    testCases.forEach((tc) => {
      test(`with ${tc.name}`, async () => {
        const response = await request.post("/upper").send({ text: tc.in }).set("Accept", "application/json")
        expect(response.status).toBe(200)
        expect(response.body).toEqual(JSON.stringify({ capitalizedText: tc.want }))
      })
    })
  })

  describe("throws error", () => {
    test("with empty string", async () => {
      const response = await request.post("/upper").send({ text: "" }).set("Accept", "application/json")
      expect(response.status).toBe(400)
    })
    test("without payload", async () => {
      const response = await request.post("/upper").set("Accept", "application/json")
      expect(response.status).toBe(400)
    })
  })
})
