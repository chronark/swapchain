import { Timer } from "./timer"

describe("constructor()", () => {
  it("", () => {
    
  })
})


// Check if the prompted input is a number
test("checks the maximum timer", async () => {
  const input = await blockSequence()
  expect(input.BlockSequence).toBe(!isNaN)
})

// Check if the default timer is 6 blocks
test("checks the default block timer", async () => {
  const timerDefault = await blockSequence()
  expect(timerDefault.defaultBlockSequence).toEqual(6)
})

// Check if the minimum timer of 4 blocks is enforced
test("checks the minimum timer", async () => {
  const minValue = await blockSequence()
  expect(minValue.BlockSequence < 4).toThrow(
    new Error("Specified blockSequence is either too high (>4000) or too low (<4)."),
  )
})

// Check if the maximum timer of 4000 blocks is enforced
test("checks the maximum timer", async () => {
  const maxValue = await blockSequence()
  expect(maxValue.maxBlockSequence > 4000).toThrow(
    new Error("Specified blockSequence is either too high (>4000) or too low (<4)."),
  )
})

// Check if minima/maxima difference is correct
test("compares the timer minimum and maximum", async () => {
  const diffValue = await blockSequence()
  expect(diffValue.minBlockSequence).toBeLessThan(diffValue.maxBlockSequence)
})
