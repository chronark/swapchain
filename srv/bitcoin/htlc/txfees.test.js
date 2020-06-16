// eslint-disable-next-line @typescript-eslint/no-var-requires
const getFees = require("./txfees")
// eslint-disable-next-line @typescript-eslint/no-var-requires
const callback = require("./txfees")

test("checks the fetch data", async () => {
  const data = await getFees()
  expect(data).toEqual(expect.anything())
})

test("compares the min and max values", async () => {
  const value = await callback()
  expect(value.minFee).toBeLessThan(value.maxFee)
})
