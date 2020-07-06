import { fakeKey, hash} from "./util"

describe("fakeKey()", () => {
    it("returns a random string with the desired length + 4", () => {
        const randomString = fakeKey(16, "testnet")

        expect(randomString.length).toBe(20)
    })
})

describe("hash()", () => {
    it("returns a hash with length 64", () => {
        const hashString = hash("XYZ")

        expect(hashString.length).toBe(64)
    })
})
