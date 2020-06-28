import { getFeesBTS } from "./btsTxFees"
 
test("compares the BTS fee value", async () => {
const value = await getFeesBTS()
expect(value).toEqual(0.04826 * 100)
})