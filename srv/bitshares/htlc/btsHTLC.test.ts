import BitsharesHTLC from "./btsHTLC"
import { Apis as btsWebsocketApi } from "bitsharesjs-ws"
import { ChainStore, FetchChain, TransactionBuilder } from "bitsharesjs"
import { stringify } from "querystring"

describe("btsHTLC", () => {
  jest.spyOn(btsWebsocketApi, "instance")
  jest.spyOn(ChainStore, "init")
  // jest.mock(FetchChain, () => {})
  it("initializes wiht a node", () => {
    const htlc = new BitsharesHTLC("node")
  })
})
