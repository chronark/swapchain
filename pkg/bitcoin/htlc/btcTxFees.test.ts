import { getFeesBTC } from "./BTCtxfees"

const useMock = jest.fn(() => {})

describe("mocking getFeesBTC()", () => {
  test("compares the mock values returned by the useMock()", () => {
    useMock.mockImplementation(() => {
      return [1, 2, 3, 4, 5]
    })

    const context = useMock()
    expect(context).toStrictEqual([1, 2, 3, 4, 5])
  })
})

describe("Test without mocking getFeeBTC()", () => {
  test("compares the values of the Fee estimates provided by the API", async () => {
    const values = await getFeesBTC()
    expect(values.length).toBe(5)
    expect(values[0]).toBeGreaterThanOrEqual(values[1])
    expect(values[1]).toBeGreaterThanOrEqual(values[2])
    expect(values[2]).toBeGreaterThanOrEqual(values[3])
    expect(values[3]).toBeGreaterThanOrEqual(values[4])
  })
})
