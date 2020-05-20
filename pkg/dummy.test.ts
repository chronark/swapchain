import { helloWorld } from "./dummy"

test("dummy test for dummy function, see ./dummy.ts", () => {
  helloWorld()
  expect(1).toBe(1)
})
