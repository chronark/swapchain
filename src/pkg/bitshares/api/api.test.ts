import { BitsharesAPI } from "./api"
import { Apis as btsWebsocketApi } from "bitsharesjs-ws"
import { ChainStore, ChainConfig, PrivateKey } from "bitsharesjs"
import { mocked } from "ts-jest/utils"
jest.mock("bitsharesjs-ws")
jest.mock("bitsharesjs")


beforeEach(() => {
  jest.resetAllMocks()
  mocked(btsWebsocketApi)
  mocked(ChainStore)
  mocked(ChainConfig)

  jest.spyOn(ChainConfig, "setChainId").mockReturnValue({})


  btsWebsocketApi.instance = jest.fn().mockResolvedValue({})
  /* eslint-disable @typescript-eslint/camelcase */
  btsWebsocketApi.db.get_accounts = jest.fn().mockResolvedValue([{ id: "1.1.1" }, { id: "1.1.2" }])
  btsWebsocketApi.history.get_relative_account_history = jest.fn().mockResolvedValue({})
  ChainStore.init = jest.fn().mockResolvedValue({})
  btsWebsocketApi.db.get_key_references = jest.fn().mockResolvedValue([["account"]])
})

describe('getInstance()', () => {
  it('should return the same instance every time', async () => {
    const api1 = await BitsharesAPI.getInstance("testnode")
    const api2 = await BitsharesAPI.getInstance("testnode")

    expect(api1).toBe(api2)
  })
})


describe('getAccountID()', () => {
  it('should call db.get_accounts correctly', async () => {
    const api = new BitsharesAPI()

    await api.getAccountID("Batman")
    expect(btsWebsocketApi.db.get_accounts).toHaveBeenCalledWith(["Batman"])

  })
})

describe('getHistory()', () => {
  it('should call db.get_accounts correctly', async () => {
    const api = new BitsharesAPI()

    await api.getHistory("BatmanID")
    expect(btsWebsocketApi.history.get_relative_account_history).toHaveBeenCalledWith("BatmanID", 0, 100, 0)

  })
})

describe('getID()', () => {
  describe('without timelock', () => {
    it('should return the ID', async () => {
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
                amount: 2
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
                amount: 2
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

  describe('with timelock', () => {
    it('should return the ID', async () => {
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
                amount: 2
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
                amount: 2
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

describe('toAccountID()', () => {

  describe('invalid key length', () => {
    it("throws an error", async () => {
      const api = new BitsharesAPI()
      await expect(api.toAccountID("shortAccount", "network")).rejects.toThrow()
    })
  })
  describe('valid network', () => {
      const networks = ["mainnet", "testnet"]
      const api = new BitsharesAPI()
    networks.forEach(network => {
      const res = api.toAccountID("5JJP3BcaaydsdF7anQjSaSvvbTyjKHZWnvwHupQGZepoq6XANXB", network)

      expect(res).toEqual("account")



    })


  })
  describe('invalid network', () => {
    it("throws", async () => {
      const api = new BitsharesAPI()
      await expect(api.toAccountID("123456789012345678901234567890123456789012345678901", "wrong network")).rejects.toThrow()
    })
  })



})


// describe("getAccount()", () => {
//   mocked(btsWebsocketApi)
//   btsWebsocketApi.instance = jest.fn().mockResolvedValue({})

//   it("Returns the corresponding Bitshares account name on mainnet", async () => {
//     btsWebsocketApi.db.get_key_references = jest.fn().mockResolvedValueOnce([["1.1.1"]])
//     btsWebsocketApi.db.get_accounts = jest.fn().mockResolvedValueOnce([{ name: "test" }])
//     const accountName = await getAccount(
//       "5JLJM1uGLTdYhnFtf55Q9pmeVaik3MpdRVnG3dHrU4NF9ApvooC",
//       "wss://myendpoint",
//       "mainnet",
//     )
//     expect(accountName).toBe("test")
//   })
//   it("Returns the corresponding Bitshares account name on testnet", async () => {
//     btsWebsocketApi.db.get_key_references = jest.fn().mockResolvedValueOnce([["1.1.1"]])
//     btsWebsocketApi.db.get_accounts = jest.fn().mockResolvedValueOnce([{ name: "test" }])
//     const accountName = await getAccount(
//       "5JLJM1uGLTdYhnFtf55Q9pmeVaik3MpdRVnG3dHrU4NF9ApvooC",
//       "wss://myendpoint",
//       "testnet",
//     )
//     expect(accountName).toBe("test")
//   })
//   it("Throws an error for invalid private key length", async () => {
//     btsWebsocketApi.db.get_key_references = jest.fn().mockResolvedValueOnce([["1.1.1"]])
//     btsWebsocketApi.db.get_accounts = jest.fn().mockResolvedValueOnce([{ name: "test" }])
//     await expect(
//       getAccount("5JLJM1uGLTdYhnFtf55Q9pmeVaik3MpdRVnG3dHrU4NF9Apvoo", "wss://myendpoint", "testnet"),
//     ).rejects.toThrow("Invalid private key length.")
//   })
//   it("Throws an error for invalid network", async () => {
//     btsWebsocketApi.db.get_key_references = jest.fn().mockResolvedValueOnce([["1.1.1"]])
//     btsWebsocketApi.db.get_accounts = jest.fn().mockResolvedValueOnce([{ name: "test" }])
//     await expect(
//       getAccount("5JLJM1uGLTdYhnFtf55Q9pmeVaik3MpdRVnG3dHrU4NF9ApvooC", "wss://myendpoint", "wrongnet"),
//     ).rejects.toThrow("Invalid network name. Choose mainnet or testnet.")
//   })
//   it("Throws an error for invalid private key length", async () => {
//     btsWebsocketApi.db.get_key_references = jest.fn().mockResolvedValueOnce([["1.1.1"]])
//     btsWebsocketApi.db.get_accounts = jest.fn().mockResolvedValueOnce([{ name: "test" }])
//     await expect(
//       getAccount("5JLJM1uGLTdYhnFtf55Q9pmeVaik3MpdRVnG3dHrU4NF9Apvoo", "wss://myendpoint", "testnet"),
//     ).rejects.toThrow("Invalid private key length.")
//   })
//   it("Throws an error if key reference was not found", async () => {
//     btsWebsocketApi.db.get_key_references = jest.fn().mockResolvedValueOnce([[]])
//     btsWebsocketApi.db.get_accounts = jest.fn().mockResolvedValueOnce([{}])

//     await expect(
//       getAccount("5JLJM1uGLTdYhnFtf55Q9pmeVaik3MpdRVnG3dHrU4NF9ApvooC", "wss://myendpoint", "testnet"),
//     ).rejects.toThrow(
//       "Could not find any accounts for private key 5JLJM1uGLTdYhnFtf55Q9pmeVaik3MpdRVnG3dHrU4NF9ApvooC on testnet",
//     )
//   })
//   it("Throws an error if account for account ID was not found", async () => {
//     btsWebsocketApi.db.get_key_references = jest.fn().mockResolvedValueOnce([["1.1.1"]])
//     btsWebsocketApi.db.get_accounts = jest.fn().mockResolvedValueOnce([{}])

//     await expect(
//       getAccount("5JLJM1uGLTdYhnFtf55Q9pmeVaik3MpdRVnG3dHrU4NF9ApvooC", "wss://myendpoint", "testnet"),
//     ).rejects.toThrow("Could not get accounts for account ID 1.1.1 on testnet")
//   })
// })
