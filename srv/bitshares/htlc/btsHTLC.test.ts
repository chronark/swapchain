import BitsharesHTLC from "./btsHTLC"
import { Apis as btsWebsocketApi } from "bitsharesjs-ws"
import { ChainStore, FetchChain, TransactionBuilder } from "bitsharesjs"
import { mocked } from "ts-jest/utils"
import { getSecret } from "../../../tmp/secret"

jest.mock("bitsharesjs")
jest.mock("bitsharesjs-ws")
jest.mock("../../../tmp/secret")

const testSecret = {
  secret: "1234567890abcdefghijklmnopqrstuv",
  hash: "testHash",
}

const htlcTestConfig = {
  sender: "amos",
  receiver: "init0",
  amount: 1,
  asset: "TEST",
  time: 30,
  privateKey: "testPrivateKey",
}

beforeEach(() => {
  jest.resetAllMocks()
  mocked(btsWebsocketApi.instance).mockImplementation(async (node: string, connect: boolean): Promise<void> => {})

  mocked(ChainStore.init).mockImplementation(async (c: boolean): Promise<void> => {})

  mocked(getSecret).mockImplementation((): { secret: string; hash: string } => {
    return testSecret
  })

  mocked(FetchChain).mockImplementation(
    async (s1: string, s2: string): Promise<Record<string, any>> => {
      return {
        get: (s: string): string => "BruceWayneIsBatman",
      }
    },
  )
})

describe("btsHTLC", () => {
  it("creates a single HTLC", async () => {
    const htlc = new BitsharesHTLC("node")
    await htlc.create(htlcTestConfig)

    expect(btsWebsocketApi.instance).toHaveBeenCalledTimes(1)
    expect(ChainStore.init).toHaveBeenCalledTimes(1)
    expect(FetchChain).toHaveBeenCalledTimes(3)
  })

  it("creates 2 HTLCs using the same websocket", async () => {
    const htlc = new BitsharesHTLC("node")
    await htlc.create(htlcTestConfig)

    expect(btsWebsocketApi.instance).toHaveBeenCalledTimes(1)
    expect(ChainStore.init).toHaveBeenCalledTimes(1)
    expect(FetchChain).toHaveBeenCalledTimes(3)

    await htlc.create(htlcTestConfig)

    expect(btsWebsocketApi.instance).toHaveBeenCalledTimes(1)
    expect(ChainStore.init).toHaveBeenCalledTimes(2)
    expect(FetchChain).toHaveBeenCalledTimes(6)
  })

  it("calls FetchChain with the correct parameters", async () => {
    const htlc = new BitsharesHTLC("node")
    await htlc.create(htlcTestConfig)

    expect(FetchChain).toHaveBeenCalledTimes(3)
    expect(FetchChain.mock.calls[0][0]).toEqual("getAccount")
    expect(FetchChain.mock.calls[0][1]).toEqual(htlcTestConfig.sender)

    expect(FetchChain.mock.calls[1][0]).toEqual("getAccount")
    expect(FetchChain.mock.calls[1][1]).toEqual(htlcTestConfig.receiver)

    expect(FetchChain.mock.calls[2][0]).toEqual("getAsset")
    expect(FetchChain.mock.calls[2][1]).toEqual(htlcTestConfig.asset)
  })

  it("calls transactionBuilder with the correct parameters", async () => {
    const addTypeOperationMock = jest.spyOn(TransactionBuilder.prototype, "add_type_operation")
    const htlc = new BitsharesHTLC("node")
    await htlc.create(htlcTestConfig)

    expect(TransactionBuilder).toHaveBeenCalledTimes(1)
    expect(addTypeOperationMock).toHaveBeenCalledTimes(1)
    /* eslint-disable @typescript-eslint/camelcase */
    expect(addTypeOperationMock).toBeCalledWith("htlc_create", {
      amount: {
        amount: 1,
        asset_id: "BruceWayneIsBatman",
      },
      claim_period_seconds: 30,
      from: "BruceWayneIsBatman",
      preimage_hash: [2, "testHash"],
      preimage_size: 32,
      to: "BruceWayneIsBatman",
    })
    /* eslint-enable @typescript-eslint/camelcase */
  })
  it("calls signs the transaction with the correct key", async () => {
    const addSignerMock = jest.spyOn(TransactionBuilder.prototype, "add_signer")
    const htlc = new BitsharesHTLC("node")
    await htlc.create(htlcTestConfig)

    expect(TransactionBuilder).toHaveBeenCalledTimes(1)
    expect(addSignerMock).toHaveBeenCalledTimes(1)
    expect(addSignerMock).toHaveBeenCalledWith(htlcTestConfig.privateKey)
  })

  it("broadcasts the transaction", async () => {
    const broadcastMock = jest.spyOn(TransactionBuilder.prototype, "broadcast")
    const htlc = new BitsharesHTLC("node")
    await htlc.create(htlcTestConfig)

    expect(TransactionBuilder).toHaveBeenCalledTimes(1)
    expect(broadcastMock).toHaveBeenCalledTimes(1)
  })

  it("returns status and secret", async () => {
    const htlc = new BitsharesHTLC("node")
    const { success, secret } = await htlc.create(htlcTestConfig)

    expect(success).toBe(true)
    expect(secret).toEqual(testSecret)
  })
})
