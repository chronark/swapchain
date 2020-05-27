import { handlerHTLC } from "./routes"
import { mockExpress } from "../../test/mocks/mockExpress"
import BitsharesHTLC from "./htlc/btsHTLC"
import { SHA256 } from "crypto-js"
import { mocked } from "ts-jest/utils"
import { HTLCConfig } from "../../pkg/types/htlc"
import { getSecret, Secret } from "../../tmp/secret"

describe("Test handlerHTLC", () => {
  describe("successfully creates and redeems htlc", () => {
    const testCases = [
      {
        method: "htlc_create",
        params: {
          node: "wss://testnet.dex.trading",
          from: "foo",
          to: "bar",
          amount: "1",
          asset: "TEST",
          time: 10,
          privateKey: "Testkey",
        },
      },
      {
        method: "htlc_redeem",
        params: {
          node: "wss://testnet.dex.trading",
          from: "foo",
          to: "bar",
          amount: "1",
          asset: "TEST",
          time: 10,
          privateKey: "Testkey2",
          secret: "TopSecret",
        },
      },
    ]

    it(`with ${testCases[0].method}`, async () => {
      jest.resetAllMocks()
      const { req, res } = mockExpress(testCases[0])
      jest
        .spyOn(BitsharesHTLC.prototype, "create")
        .mockImplementation(async (config: HTLCConfig, privateKey: string, preimage: Secret): Promise<boolean> => true)

      await handlerHTLC(req, res)

      expect(BitsharesHTLC.prototype.create).toHaveBeenCalledTimes(1)
    })

    it(`with ${testCases[1].method}`, async () => {
      jest.resetAllMocks()
      const { req, res } = mockExpress(testCases[1])
      jest
        .spyOn(BitsharesHTLC.prototype, "redeem")
        .mockImplementation(async (config: HTLCConfig, privateKey: string, preimage: Secret): Promise<boolean> => true)

      await handlerHTLC(req, res)

      expect(BitsharesHTLC.prototype.redeem).toHaveBeenCalledTimes(1)
      expect(BitsharesHTLC.prototype.redeem).toHaveBeenCalledWith(
        {
          sender: testCases[1].params.from,
          receiver: testCases[1].params.to,
          amount: testCases[1].params.amount,
          asset: testCases[1].params.asset,
          time: testCases[1].params.time,
        },
        testCases[1].params.privateKey,
        {
          secret: req.body.params.secret,
          hash: SHA256(req.body.params.secret).toString(),
        },
      )
    })
  })

  describe("basic error handling", () => {
    it("should handle error with no method and params given", async () => {
      jest.resetAllMocks()
      const { req, res } = mockExpress({ bar: "foo", foo: "bar" })

      await handlerHTLC(req, res)

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid request body" })
    })

    it("should handle error with wrong method given", async () => {
      jest.resetAllMocks()
      const { req, res } = mockExpress({
        method: "transfer",
        params: {
          node: "wss://testnet.dex.trading",
          from: "foo",
          to: "bar",
          amount: "1",
          asset: "TEST",
          time: 10,
          privateKey: "Testkey",
        },
      })

      await handlerHTLC(req, res)

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid method" })
    })
  })
})
