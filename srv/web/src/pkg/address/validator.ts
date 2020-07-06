export function isValidPrivateKeyBTC(privateKey: string, network: string): boolean {
    if (network === "mainnet") {
        return (privateKey.length === 51 || privateKey.length === 52) && (privateKey.startsWith("5") || privateKey.startsWith("L") || privateKey.startsWith("K"))
    } else if (network === "testnet") {
        return (privateKey.length === 51 || privateKey.length === 52) && (privateKey.startsWith("9") || privateKey.startsWith("c"))
    } else {
        throw new Error("Invalid network name. Choose mainnet or testnet.")
    }
}

export function isValidPublicKeyBTC(publicKey: string): boolean {
    return publicKey.length === 66 || publicKey.length === 130
}

export function isValidPrivateKeyBTS(privateKey: string): boolean {
    return privateKey.length === 51
}