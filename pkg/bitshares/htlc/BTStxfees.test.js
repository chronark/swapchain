// eslint-disable-next-line @typescript-eslint/no-var-requires
const callback = require("./BTStxfees")

test("compares the min and max values", async () => {
  const value = callback()
  expect(value).toEqual(0.04826 * 100)
})
