import { Apis as btsWebsocketApi, ChainConfig } from "bitsharesjs-ws"
import { PrivateKey } from "bitsharesjs"

export async function getAccount(privateKey: string, node: string, network: string): Promise<string> {

    if (privateKey.length !== 51) {
        throw new Error("Invalid private key length.")
    }

    // Set chain IDs to get correct prefix for public key
    if (network === "mainnet") {
        ChainConfig.setChainId("4018d7844c78f6a6c41c6a552b898022310fc5dec06da467ee7905a8dad512c8")
    } else if (network === "testnet") {
        ChainConfig.setChainId("39f5e2ede1f8bc1a3a54a7914414e3779e33193f1f5693510e73cb7a87617447")
    } else {
        throw new Error("Invalid network name. Choose mainnet or testnet.")
    }

    const publicKey = PrivateKey.fromWif(privateKey).toPublicKey().toString()

    await btsWebsocketApi.instance(node, true).init_promise

    const accounts = await btsWebsocketApi.db.get_key_references([publicKey])

    if (typeof accounts[0][0] === "undefined") {
        throw new Error(`Could not find any accounts for private key ${privateKey} on ${network}`)
    }

    const accountID = accounts[0][0]

    const accountNames = await btsWebsocketApi.db.get_accounts([accountID])

    if (Object.keys(accountNames[0]).length === 0) {
        throw new Error(`Could not get accounts for account ID ${accountID} on ${network}`)
    }
    
    return accountNames[0].name
}