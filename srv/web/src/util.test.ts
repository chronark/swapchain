import { fakeKey, hash, toPublicKey } from "./util"

describe("fakeKey()", () => {
  describe("with a network defined", () => {
    it("returns a random string with the desired length + 4", () => {
      const randomString = fakeKey(19, "testnet")

      expect(randomString.length).toBe(20)
    })
  })
  describe("without a network", () => {
    it("returns a random string with the desired length + 4", () => {
      const randomString = fakeKey(32)

      expect(randomString.length).toBe(32)
    })
  })
})

describe("hash()", () => {
  it("returns a hash with length 64", () => {
    const hashString = hash("XYZ")

    expect(hashString.length).toBe(64)
  })
})

describe("toPublicKey()", () => {
  it("returns the correct public key", () => {
    const res = toPublicKey("cVPwsbE8HNMCoLGz8N4R2SfyQTMQzznL9x3vEHJqPtuZ1rhBkTo7")
    expect(res).toBe("034c7ddacc16fa5e53aa5dc19748e3877ba07b981fdbbcdb97b8b19de240241f61")
  })
})
