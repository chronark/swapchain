import BitsharesHTLC from "./btsHTLC"
import { Apis as btsWebsocketApi } from "bitsharesjs-ws"
import { ChainStore, FetchChain, TransactionBuilder, PrivateKey } from "bitsharesjs"
import { mocked } from "ts-jest/utils"
import { getSecret } from "../../../pkg/secret/secret"

jest.mock("bitsharesjs")
jest.mock("bitsharesjs-ws")
jest.mock("../../../pkg/secret/secret")

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
}

const privateKey = "5JWd27Ff5iofr741ewr4CdHzxgENXzobBaxtZNBBjRZBvsZ9SZ6"

beforeEach(() => {
  jest.resetAllMocks()
  mocked(btsWebsocketApi)

  btsWebsocketApi.instance = jest.fn().mockImplementation(async (node: string, connect: boolean): Promise<void> => {})
  /* eslint-disable @typescript-eslint/camelcase */
  btsWebsocketApi.db.get_accounts = jest
    .fn()
    .mockImplementation(async (s: string[]): Promise<Record<string, string>[]> => [{ id: "1.1.1" }, { id: "1.1.2" }])
  /* eslint-enable @typescript-eslint/camelcase */

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
    await htlc.create(htlcTestConfig, privateKey, testSecret)

    expect(btsWebsocketApi.instance).toHaveBeenCalledTimes(1)
    expect(ChainStore.init).toHaveBeenCalledTimes(1)
    expect(FetchChain).toHaveBeenCalledTimes(3)
  })

  it("creates 2 HTLCs using the same websocket", async () => {
    const htlc = new BitsharesHTLC("node")
    await htlc.create(htlcTestConfig, privateKey, testSecret)

    expect(btsWebsocketApi.instance).toHaveBeenCalledTimes(1)
    expect(ChainStore.init).toHaveBeenCalledTimes(1)
    expect(FetchChain).toHaveBeenCalledTimes(3)

    await htlc.create(htlcTestConfig, privateKey, testSecret)

    expect(btsWebsocketApi.instance).toHaveBeenCalledTimes(1)
    expect(ChainStore.init).toHaveBeenCalledTimes(2)
    expect(FetchChain).toHaveBeenCalledTimes(6)
  })

  it("redeems a single HTLC", async () => {
    /* eslint-disable @typescript-eslint/camelcase */
    btsWebsocketApi.history.get_relative_account_history = jest.fn().mockImplementation(
      async (receiver: string, start: number, limit: number, stop: number): Promise<any[]> => {
        return [
          {
            id: "1.11.1337",
            op: [
              49,
              {
                fee: [{}],
                from: "1.1.1",
                to: "1.1.2",
                amount: [{}],
                preimage_hash: [2, "testHash"],
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
        ]
      },
    )
    /* eslint-enable @typescript-eslint/camelcase */

    const htlc = new BitsharesHTLC("node")
    await htlc.redeem(htlcTestConfig, privateKey, testSecret)

    expect(btsWebsocketApi.instance).toHaveBeenCalledTimes(1)
    expect(ChainStore.init).toHaveBeenCalledTimes(1)
    expect(FetchChain).toHaveBeenCalledTimes(1)
  })

  it("redeems 2 HTLCs using the same websocket", async () => {
    /* eslint-disable @typescript-eslint/camelcase */
    btsWebsocketApi.history.get_relative_account_history = jest.fn().mockImplementation(
      async (receiver: string, start: number, limit: number, stop: number): Promise<any[]> => {
        return [
          {
            id: "1.11.1337",
            op: [
              49,
              {
                fee: [{}],
                from: "1.1.1",
                to: "1.1.2",
                amount: [{}],
                preimage_hash: [2, "testHash"],
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
        ]
      },
    )
    /* eslint-enable @typescript-eslint/camelcase */

    const htlc = new BitsharesHTLC("node")
    await htlc.redeem(htlcTestConfig, privateKey, testSecret)

    expect(btsWebsocketApi.instance).toHaveBeenCalledTimes(1)
    expect(ChainStore.init).toHaveBeenCalledTimes(1)
    expect(FetchChain).toHaveBeenCalledTimes(1)

    await htlc.redeem(htlcTestConfig, privateKey, testSecret)

    expect(btsWebsocketApi.instance).toHaveBeenCalledTimes(1)
    expect(ChainStore.init).toHaveBeenCalledTimes(2)
    expect(FetchChain).toHaveBeenCalledTimes(2)
  })

  describe("Throws error because HTLC was not found", () => {
    // All these test cases will throw an error.
    /* eslint-disable @typescript-eslint/camelcase */
    const testCases = [
      {
        name: "element.result[1] is not a string",
        mockReturn: [
          {
            id: "1.11.1337",
            op: [
              49, // random number not required for this test
              {
                from: "1.1.1",
                to: "1.1.2",
                preimage_hash: [2, "testHash"],
              },
            ],
            result: [1, 2],
          },
        ],
      },
      {
        name: "element.result[1] does not start with <1.16.>",
        mockReturn: [
          {
            id: "1.11.1337",
            op: [
              49, // random number not required for this test
              {
                from: "1.1.1",
                to: "1.1.2",
                preimage_hash: [2, "testHash"],
              },
            ],
            result: [1, "2.16.111"],
          },
        ],
      },
      {
        name: "element.op[1].from is not correct",
        mockReturn: [
          {
            id: "1.11.1337",
            op: [
              49, // random number not required for this test
              {
                from: "Hans Wurst 1.1.1",
                to: "1.1.2",
                preimage_hash: [2, "testHash"],
              },
            ],
            result: [1, "1.16.111"],
          },
        ],
      },
      {
        name: "element.op[1].to is not correct",
        mockReturn: [
          {
            id: "1.11.1337",
            op: [
              49, // random number not required for this test
              {
                from: "1.1.1",
                to: "amos",
                preimage_hash: [2, "testHash"],
              },
            ],
            result: [1, "1.16.111"],
          },
        ],
      },
      {
        name: "element.op[1].preimage_hash[1] is not correct",
        mockReturn: [
          {
            id: "1.11.1337",
            op: [
              49, // random number not required for this test
              {
                from: "1.1.1",
                to: "1.1.2",
                preimage_hash: [2, "wrongHash"],
              },
            ],
            result: [1, "1.16.111"],
          },
        ],
      },
    ]
    /* eslint-enable @typescript-eslint/camelcase */

    testCases.forEach((tc) => {
      it(tc.name, async () => {
        /* eslint-disable-next-line @typescript-eslint/camelcase */
        btsWebsocketApi.history.get_relative_account_history = jest.fn().mockImplementation(
          async (receiver: string, start: number, limit: number, stop: number): Promise<Record<string, any>[]> => {
            return tc.mockReturn
          },
        )
        const htlc = new BitsharesHTLC("node")

        await expect(() => htlc.redeem(htlcTestConfig, privateKey, testSecret)).rejects.toThrow()

        expect(btsWebsocketApi.instance).toHaveBeenCalledTimes(1)
        expect(ChainStore.init).toHaveBeenCalledTimes(1)
        expect(FetchChain).toHaveBeenCalledTimes(1)
      })
    })
  })

  it("calls FetchChain with the correct parameters", async () => {
    const htlc = new BitsharesHTLC("node")
    await htlc.create(htlcTestConfig, privateKey, testSecret)

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
    await htlc.create(htlcTestConfig, privateKey, testSecret)

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
    await htlc.create(htlcTestConfig, privateKey, testSecret)

    expect(TransactionBuilder).toHaveBeenCalledTimes(1)
    expect(addSignerMock).toHaveBeenCalledTimes(1)
    expect(addSignerMock).toHaveBeenCalledWith(PrivateKey.fromWif(privateKey))
  })

  it("broadcasts the transaction", async () => {
    const broadcastMock = jest.spyOn(TransactionBuilder.prototype, "broadcast")
    const htlc = new BitsharesHTLC("node")
    await htlc.create(htlcTestConfig, privateKey, testSecret)

    expect(TransactionBuilder).toHaveBeenCalledTimes(1)
    expect(broadcastMock).toHaveBeenCalledTimes(1)
  })

  it("returns status", async () => {
    const htlc = new BitsharesHTLC("node")
    const success = await htlc.create(htlcTestConfig, privateKey, testSecret)

    expect(success).toBe(true)
  })
})
