import ACCS, { ACCSConfig } from "./accs"
import * as bitcoin from "bitcoinjs-lib"
import { mocked } from "ts-jest/utils"
import { getSecret, Secret } from "../../pkg/secret/secret"
jest.mock("../../pkg/secret/secret")

describe("ACCS tests", () => {
    it("it returns user input as ACCS config object correctly", async () => {
        const preimage = "TOPSECRETTOPSECRETTOPSECRETTOPSE"
        const secretObject = {
            preimage,
            hash: bitcoin.crypto.sha256(Buffer.from(preimage))
        }
        jest.spyOn(console, "log").mockImplementation(() => {})
        jest.spyOn(ACCS.prototype, "askUser")
            .mockReturnValueOnce(Promise.resolve("Proposer"))
            .mockReturnValueOnce(Promise.resolve("1"))
            .mockReturnValueOnce(Promise.resolve("testBTSAccount"))
            .mockReturnValueOnce(Promise.resolve("testBTSPrivateKey"))
            .mockReturnValueOnce(Promise.resolve("cTZs9RHsw3nDt98nDNSw3BDs53yaWmQkDFaF8MtBWEMkPMrg42t5"))
            .mockReturnValueOnce(Promise.resolve("testBTSCounterpartyAccount"))
            .mockReturnValueOnce(Promise.resolve("03c11fe663a2e72b2c0a67d23235d5320d6d7efede7c99f1322b05665e15d129ed"))
            .mockReturnValueOnce(Promise.resolve("0.001"))
            .mockReturnValueOnce(Promise.resolve("testBTCTxID"))
        mocked(getSecret).mockImplementation((): Secret => {return secretObject})

        const expectedACCSConfig: ACCSConfig = {
            txMode: "proposer",
            txType: "1",
            txTypeName: "BTS/BTC",
            accountBTS: "testBTSAccount",
            privateKeyBTS: "testBTSPrivateKey",
            accountCounterpartyBTS: "testBTSCounterpartyAccount",
            amount: "0.001",
            rateBTSBTC: 500000,
            amountBTSMini: 50000000,
            amountSatoshi: 100000,
            keyPairCompressedBTC: bitcoin.ECPair.fromPrivateKey(bitcoin.ECPair.fromWIF("cTZs9RHsw3nDt98nDNSw3BDs53yaWmQkDFaF8MtBWEMkPMrg42t5", bitcoin.networks.testnet).privateKey!, { compressed: true }),
            keyPairCounterpartyCompressedBTC: bitcoin.ECPair.fromPublicKey(
                Buffer.from("03c11fe663a2e72b2c0a67d23235d5320d6d7efede7c99f1322b05665e15d129ed", "hex"),
                {
                  compressed: true,
                },
              ),
            speedBTC: 500,
            timelockBTC: 6,
            timelockBTS: 3000,
            secret: secretObject,
            txIdBTC: "testBTCTxID",
        }
        const accs = new ACCS("testnet")

        const accsConfig = await accs.getUserInput()

        expect(accsConfig.txMode).toBe(expectedACCSConfig.txMode)
    })
})