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
    const value = await getFeesBTC()
    expect(value.length).toBe(5)
    expect(value[0]).toBeGreaterThanOrEqual(value[1])
    expect(value[1]).toBeGreaterThanOrEqual(value[2])
    expect(value[2]).toBeGreaterThanOrEqual(value[3])
    expect(value[3]).toBeGreaterThanOrEqual(value[4])
  })
})
