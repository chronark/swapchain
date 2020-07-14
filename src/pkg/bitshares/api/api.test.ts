import { BitsharesAPI } from "./api"
import { Apis as btsWebsocketApi, ChainConfig } from "bitsharesjs-ws"
import { ChainStore, PrivateKey, PublicKey } from "bitsharesjs"
import { mocked } from "ts-jest/utils"
jest.mock("bitsharesjs-ws")
jest.mock("bitsharesjs")


beforeEach(() => {
  jest.resetAllMocks()
  mocked(btsWebsocketApi)
  mocked(ChainStore)
  mocked(ChainConfig)
  ChainConfig.setChainId = jest.fn().mockReturnValue({})
  mocked(PrivateKey)
  PrivateKey.fromWif = jest.fn().mockReturnValue({
    toPublicKey: () => {
      return {
        toString: () => "testPublicKey",
      }
    },
  })

  btsWebsocketApi.instance = jest.fn().mockResolvedValue({})
  /* eslint-disable @typescript-eslint/camelcase */
  btsWebsocketApi.db.get_accounts = jest.fn().mockResolvedValue([{ id: "1.1.1" }, { id: "1.1.2" }])
  btsWebsocketApi.history.get_relative_account_history = jest.fn().mockResolvedValue({})
  ChainStore.init = jest.fn().mockResolvedValue({})
})

describe("getInstance()", () => {
  it("should return the same instance every time", async () => {
    const api1 = await BitsharesAPI.getInstance("testnode")
    const api2 = await BitsharesAPI.getInstance("testnode")

    expect(api1).toBe(api2)
  })
})

describe("getAccountID()", () => {
  it("should call db.get_accounts correctly", async () => {
    const api = new BitsharesAPI()
    await api.getAccountID("Batman")
    expect(btsWebsocketApi.db.get_accounts).toHaveBeenCalledWith(["Batman"])
  })
})

describe("getHistory()", () => {
  it("should call db.get_accounts correctly", async () => {
    const api = new BitsharesAPI()

    await api.getHistory("BatmanID")
    expect(btsWebsocketApi.history.get_relative_account_history).toHaveBeenCalledWith("BatmanID", 0, 100, 0)
  })
})

describe("getID()", () => {
  describe("without timelock", () => {
    it("should return the ID", async () => {
      const api = new BitsharesAPI()
      jest.spyOn(api, "getHistory").mockResolvedValueOnce([
        {
          id: "1.11.1337",
          op: [
            49,
            {
              fee: [{}],
              from: "1.1.1",
              to: "1.1.2",
              amount: {
                amount: 2,
              },
              preimage_hash: [2, Buffer.from("testHash").toString("hex")],
              preimage_size: 32,
              claim_period_seconds: 30,
              extensions: [],
            },
          ],
          result: [1, "1.16.111"],
          block_num: 1337,
          trx_in_block: 0,
          op_in_trx: 0,
          virtual_op: 0,
        },
      ])
      const res = await api.getID("1.1.1", "1.1.2", 2, Buffer.from("testHash"))
      expect(res).toBe("1.16.111")
    })
    it("should throw", async () => {
      const api = new BitsharesAPI()
      jest.spyOn(api, "getHistory").mockResolvedValueOnce([
        {
          id: "1.11.1337",
          op: [
            49,
            {
              fee: [{}],
              from: "1.1.1",
              to: "1.1.2",
              amount: {
                amount: 2,
              },
              preimage_hash: [2, Buffer.from("testHash").toString("hex")],
              preimage_size: 32,
              claim_period_seconds: 30,
              extensions: [],
            },
          ],
          result: [1, "1.16.111"],
          block_num: 1337,
          trx_in_block: 0,
          op_in_trx: 0,
          virtual_op: 0,
        },
      ])
      await expect(api.getID("1.1.1", "1.1.2", 4, Buffer.from("testHash"))).rejects.toThrow()
    })
  })

  describe("with timelock", () => {
    it("should return the ID", async () => {
      const api = new BitsharesAPI()
      jest.spyOn(api, "getHistory").mockResolvedValueOnce([
        {
          id: "1.11.1337",
          op: [
            49,
            {
              fee: [{}],
              from: "1.1.1",
              to: "1.1.2",
              amount: {
                amount: 2,
              },
              preimage_hash: [2, Buffer.from("testHash").toString("hex")],
              preimage_size: 32,
              claim_period_seconds: 30,
              extensions: [],
            },
          ],
          result: [1, "1.16.111"],
          block_num: 1337,
          trx_in_block: 0,
          op_in_trx: 0,
          virtual_op: 0,
        },
      ])
      const res = await api.getID("1.1.1", "1.1.2", 2, Buffer.from("testHash"), 2)
      expect(res).toBe("1.16.111")
    })
    it("should throw", async () => {
      const api = new BitsharesAPI()
      jest.spyOn(api, "getHistory").mockResolvedValueOnce([
        {
          id: "1.11.1337",
          op: [
            49,
            {
              fee: [{}],
              from: "1.1.1",
              to: "1.1.2",
              amount: {
                amount: 2,
              },
              preimage_hash: [2, Buffer.from("testHash").toString("hex")],
              preimage_size: 32,
              claim_period_seconds: 30,
              extensions: [],
            },
          ],
          result: [1, "1.16.111"],
          block_num: 1337,
          trx_in_block: 0,
          op_in_trx: 0,
          virtual_op: 0,
        },
      ])
      await expect(api.getID("1.1.1", "1.1.2", 2, Buffer.from("testHash"), 300)).rejects.toThrow()
    })
  })
})

describe("toAccountID()", () => {
  describe("invalid key length", () => {
    it("throws an error", async () => {
      const api = new BitsharesAPI()
      await expect(api.toAccountID("shortAccount", "network")).rejects.toThrow()
    })
  })
  describe("valid network", () => {
    const networks = ["mainnet", "testnet"]
    const api = new BitsharesAPI()
    networks.forEach((network) => {
      it("returns the correct account ID", async () => {
        btsWebsocketApi.db.get_key_references = jest.fn().mockResolvedValueOnce([["account"]])

        const res = await api.toAccountID("5JJP3BcaaydsdF7anQjSaSvvbTyjKHZWnvwHupQGZepoq6XANXB", network)

        expect(res).toEqual("account")
      })
    })
    it("throws if no account was found", async () => {
      btsWebsocketApi.db.get_key_references = jest.fn().mockResolvedValue([[]])

      await expect(api.toAccountID("5JJP3BcaaydsdF7anQjSaSvvbTyjKHZWnvwHupQGZepoq6XANXB", "testnet")).rejects.toThrow()
    })
  })
  describe("invalid network", () => {
    it("throws", async () => {
      const api = new BitsharesAPI()
      await expect(
        api.toAccountID("123456789012345678901234567890123456789012345678901", "wrong network"),
      ).rejects.toThrow()
    })
  })

  describe("getPreimageFromHTLC()", () => {
    it("extracts the preimage correctly", async () => {
      const api = new BitsharesAPI()
      const preimage = "supersecretsupersecretsupersecre"
      const serializedSecretHash = Buffer.from("testHash").toString("hex")

      jest.spyOn(api, "getHistory").mockResolvedValueOnce([
        {
          id: "1.11.1337",
          op: [
            49,
            {
              fee: [{}],
              from: "1.1.1",
              to: "1.1.2",
              amount: {
                amount: 2,
              },
              preimage: Buffer.from(preimage).toString("hex"),
              htlc_preimage_hash: [2, serializedSecretHash],
              preimage_size: 32,
              claim_period_seconds: 30,
              extensions: [],
            },
          ],
          result: [1, "1.16.111"],
          block_num: 1337,
          trx_in_block: 0,
          op_in_trx: 0,
          virtual_op: 0,
        },
      ])

      const extractedPreimage = await api.getPreimageFromHTLC("1.1.1", "1.1.2", serializedSecretHash)

      expect(preimage).toBe(preimage)
    })
    it("throws if no HTLC was found", async () => {
      const api = new BitsharesAPI()
      const preimage = "supersecretsupersecretsupersecre"
      const serializedSecretHash = Buffer.from("testHash").toString("hex")

      jest.spyOn(api, "getHistory").mockResolvedValueOnce([
        {
          id: "1.11.1337",
          op: [
            49,
            {
              fee: [{}],
              from: "1.1.1",
              to: "1.1.2",
              amount: {
                amount: 2,
              },
              preimage: Buffer.from(preimage).toString("hex"),
              htlc_preimage_hash: [2, serializedSecretHash],
              preimage_size: 32,
              claim_period_seconds: 30,
              extensions: [],
            },
          ],
          result: [1, "1.16.111"],
          block_num: 1337,
          trx_in_block: 0,
          op_in_trx: 0,
          virtual_op: 0,
        },
      ])

      await expect(api.getPreimageFromHTLC("1.1.5", "1.1.8", "wrongHash")).rejects.toThrow()
    })
  })
})
