import { getAccount } from "./util"
import { Apis as btsWebsocketApi } from "bitsharesjs-ws"
import { mocked } from "ts-jest/utils"
jest.mock("bitsharesjs-ws")

describe("getAccount()", () => {
    mocked(btsWebsocketApi)
    btsWebsocketApi.instance = jest.fn().mockResolvedValue({})

    it("Returns the corresponding Bitshares account name on mainnet", async () => {
        btsWebsocketApi.db.get_key_references = jest.fn().mockResolvedValueOnce([["1.1.1"]])
        btsWebsocketApi.db.get_accounts = jest.fn().mockResolvedValueOnce([{ name: "test" }])
        const accountName = await getAccount("5JLJM1uGLTdYhnFtf55Q9pmeVaik3MpdRVnG3dHrU4NF9ApvooC", "wss://myendpoint", "mainnet")
        expect(accountName).toBe("test")
    })
    it("Returns the corresponding Bitshares account name on testnet", async () => {
        btsWebsocketApi.db.get_key_references = jest.fn().mockResolvedValueOnce([["1.1.1"]])
        btsWebsocketApi.db.get_accounts = jest.fn().mockResolvedValueOnce([{ name: "test" }])
        const accountName = await getAccount("5JLJM1uGLTdYhnFtf55Q9pmeVaik3MpdRVnG3dHrU4NF9ApvooC", "wss://myendpoint", "testnet")
        expect(accountName).toBe("test")
    })
    it("Throws an error for invalid private key length", async () => {
        btsWebsocketApi.db.get_key_references = jest.fn().mockResolvedValueOnce([["1.1.1"]])
        btsWebsocketApi.db.get_accounts = jest.fn().mockResolvedValueOnce([{ name: "test" }])
        await expect(getAccount("5JLJM1uGLTdYhnFtf55Q9pmeVaik3MpdRVnG3dHrU4NF9Apvoo", "wss://myendpoint", "testnet")).rejects.toThrow("Invalid private key length.")
    })
    it("Throws an error for invalid network", async () => {
        btsWebsocketApi.db.get_key_references = jest.fn().mockResolvedValueOnce([["1.1.1"]])
        btsWebsocketApi.db.get_accounts = jest.fn().mockResolvedValueOnce([{ name: "test" }])
        await expect(getAccount("5JLJM1uGLTdYhnFtf55Q9pmeVaik3MpdRVnG3dHrU4NF9ApvooC", "wss://myendpoint", "wrongnet")).rejects.toThrow("Invalid network name. Choose mainnet or testnet.")
    })
    it("Throws an error for invalid private key length", async () => {
        btsWebsocketApi.db.get_key_references = jest.fn().mockResolvedValueOnce([["1.1.1"]])
        btsWebsocketApi.db.get_accounts = jest.fn().mockResolvedValueOnce([{ name: "test" }])
        await expect(getAccount("5JLJM1uGLTdYhnFtf55Q9pmeVaik3MpdRVnG3dHrU4NF9Apvoo", "wss://myendpoint", "testnet")).rejects.toThrow("Invalid private key length.")
    })
    it("Throws an error if key reference was not found", async () => {
        btsWebsocketApi.db.get_key_references = jest.fn().mockResolvedValueOnce([[]])
        btsWebsocketApi.db.get_accounts = jest.fn().mockResolvedValueOnce([{}])

        await expect(getAccount("5JLJM1uGLTdYhnFtf55Q9pmeVaik3MpdRVnG3dHrU4NF9ApvooC", "wss://myendpoint", "testnet")).rejects.toThrow("Could not find any accounts for private key 5JLJM1uGLTdYhnFtf55Q9pmeVaik3MpdRVnG3dHrU4NF9ApvooC on testnet")
    })
    it("Throws an error if account for account ID was not found", async () => {
        btsWebsocketApi.db.get_key_references = jest.fn().mockResolvedValueOnce([["1.1.1"]])
        btsWebsocketApi.db.get_accounts = jest.fn().mockResolvedValueOnce([{}])

        await expect(getAccount("5JLJM1uGLTdYhnFtf55Q9pmeVaik3MpdRVnG3dHrU4NF9ApvooC", "wss://myendpoint", "testnet")).rejects.toThrow("Could not get accounts for account ID 1.1.1 on testnet")
    })
})
