import { getUserInput } from "./getUserInput"
import * as util from "./util"
import { getSecret } from "../pkg/secret/secret"
import * as bitcoin from "bitcoinjs-lib"
import { ACCSFields } from "../pkg/accs/accs"
import { mocked } from "ts-jest/utils"
import readline from "readline"
jest.mock("../pkg/secret/secret")
jest.mock("./util")
console.log = jest.fn()
readline.createInterface = jest.fn()
const read = {} as readline.Interface

describe("getUserInput()", () => {
  it("it returns user input as ACCS fields object correctly for proposer BTS", async () => {
    const preimage = "TOPSECRETTOPSECRETTOPSECRETTOPSE"
    const secretObject = {
      preimage,
      hash: bitcoin.crypto.sha256(Buffer.from(preimage)),
    }
    mocked(getSecret).mockReturnValueOnce(secretObject)
    jest
      .spyOn(util, "askUser")
      .mockReturnValueOnce(Promise.resolve("proposer")) //mode
      .mockReturnValueOnce(Promise.resolve("testnet")) //networkToTrade
      .mockReturnValueOnce(Promise.resolve("BTC")) // currencyToGive
      .mockReturnValueOnce(Promise.resolve("0")) // priority
      .mockReturnValueOnce(Promise.resolve("cVPwsbE8HNMCoLGz8N4R2SfyQTMQzznL9x3vEHJqPtuZ1rhBkTo7")) // bitcoinPrivateKey
      .mockReturnValueOnce(Promise.resolve("5Z89Ve18ttnu7Ymd1nnCMsnGkfKk4KQnsfFrYEz7Cmw39FAMOSS")) // bitsharesPrivateKey
      .mockReturnValueOnce(Promise.resolve("034c7ddacc16fa5e53aa5dc19748e3877ba07b981fdbbcdb97b8b19de240241f61")) // counterpartyBitcoinPublicKey
      .mockReturnValueOnce(Promise.resolve("testBTSCounterpartyAccount")) // counterpartyBitsharesAccountName
      .mockReturnValueOnce(Promise.resolve("0.001")) // amount
      .mockReturnValueOnce(Promise.resolve("200000")) // exchangeRate
      .mockReturnValueOnce(Promise.resolve("2")) // timelock
      .mockReturnValueOnce(Promise.resolve("testBTCTxID")) // bitcoinTxID

    const expectedACCSFields: ACCSFields = {
      mode: "proposer",
      networkToTrade: "testnet",
      currencyToGive: "BTC",
      amountToSend: 0.001,
      rate: 200_000,
      amountToReceive: 200,
      priority: 0,
      bitcoinPrivateKey: "cVPwsbE8HNMCoLGz8N4R2SfyQTMQzznL9x3vEHJqPtuZ1rhBkTo7",
      bitsharesPrivateKey: "5Z89Ve18ttnu7Ymd1nnCMsnGkfKk4KQnsfFrYEz7Cmw39FAMOSS",
      counterpartyBitcoinPublicKey: "034c7ddacc16fa5e53aa5dc19748e3877ba07b981fdbbcdb97b8b19de240241f61",
      counterpartyBitsharesAccountName: "testBTSCounterpartyAccount",
      secret: secretObject,
      bitcoinTxID: "testBTCTxID",
    }

    const accsFields = await getUserInput(read)

    expect(accsFields.mode).toBe(expectedACCSFields.mode)
    expect(accsFields.currencyToGive).toBe(expectedACCSFields.currencyToGive)
    expect(accsFields.priority).toBe(expectedACCSFields.priority)
    expect(accsFields.amountToSend).toBe(expectedACCSFields.amountToSend)
    expect(accsFields.amountToReceive).toBe(expectedACCSFields.amountToReceive)
    expect(accsFields.rate).toBe(expectedACCSFields.rate)
    expect(accsFields.secret).toEqual(expectedACCSFields.secret)
  })

  it("it returns user input as ACCS fields object correctly for accepter BTS", async () => {
    const preimage = "TOPSECRETTOPSECRETTOPSECRETTOPSE"
    const secretObjectAccepter = {
      preimage: undefined,
      hash: bitcoin.crypto.sha256(Buffer.from(preimage)),
    }
    jest
      .spyOn(util, "askUser")
      .mockReturnValueOnce(Promise.resolve("accepter")) //mode
      .mockReturnValueOnce(Promise.resolve("testnet")) //networkToTrade
      .mockReturnValueOnce(Promise.resolve("BTS")) // currencyToGive
      .mockReturnValueOnce(Promise.resolve("1")) // priority
      .mockReturnValueOnce(Promise.resolve("cVPwsbE8HNMCoLGz8N4R2SfyQTMQzznL9x3vEHJqPtuZ1rhBkTo7")) // bitcoinPrivateKey
      .mockReturnValueOnce(Promise.resolve("5Z89Ve18ttnu7Ymd1nnCMsnGkfKk4KQnsfFrYEz7Cmw39FAMOSS")) // bitsharesPrivateKey
      .mockReturnValueOnce(Promise.resolve("034c7ddacc16fa5e53aa5dc19748e3877ba07b981fdbbcdb97b8b19de240241f61")) // counterpartyBitcoinPublicKey
      .mockReturnValueOnce(Promise.resolve("testBTSCounterpartyAccount")) // counterpartyBitsharesAccountName
      .mockReturnValueOnce(Promise.resolve("200")) // amount
      .mockReturnValueOnce(Promise.resolve("200000")) // exchangeRate
      .mockReturnValueOnce(Promise.resolve("0")) // timelock
      .mockReturnValueOnce(Promise.resolve(secretObjectAccepter.hash.toString("hex"))) // secret hash

    const expectedACCSFields: ACCSFields = {
      mode: "accepter",
      networkToTrade: "testnet",
      currencyToGive: "BTS",
      amountToSend: 200,
      rate: 200_000,
      amountToReceive: 0.001,
      priority: 1,
      bitcoinPrivateKey: "cVPwsbE8HNMCoLGz8N4R2SfyQTMQzznL9x3vEHJqPtuZ1rhBkTo7",
      bitsharesPrivateKey: "5Z89Ve18ttnu7Ymd1nnCMsnGkfKk4KQnsfFrYEz7Cmw39FAMOSS",
      counterpartyBitcoinPublicKey: "034c7ddacc16fa5e53aa5dc19748e3877ba07b981fdbbcdb97b8b19de240241f61",
      counterpartyBitsharesAccountName: "testBTSCounterpartyAccount",
      secret: secretObjectAccepter,
      bitcoinTxID: "testBTCTxID",
    }

    const accsFields = await getUserInput(read)

    expect(accsFields.mode).toBe(expectedACCSFields.mode)
    expect(accsFields.currencyToGive).toBe(expectedACCSFields.currencyToGive)
    expect(accsFields.priority).toBe(expectedACCSFields.priority)
    expect(accsFields.amountToSend).toBe(expectedACCSFields.amountToSend)
    expect(accsFields.amountToReceive).toBe(expectedACCSFields.amountToReceive)
    expect(accsFields.rate).toBe(expectedACCSFields.rate)
    expect(accsFields.secret.preimage).toBeUndefined()
    expect(accsFields.secret.hash.toString("hex")).toBe(expectedACCSFields.secret.hash.toString("hex"))
  })
})
