import BitsharesHTLC from "../srv/bitshares/htlc/btsHTLC"
import { Secret } from "./secret"
import { HTLCConfig } from "../pkg/types/htlc"

const privateKey = "YYY"

const config = {
  sender: "amos",
  receiver: "amos2",
  amount: 1,
  asset: "TEST",
  time: 600,
}

const secret: Secret = {
  secret: "fYXtFWlRUEtqfFtaaCzQWTk5yCnp9qIM",
  hash: "e149f1a5e0a971ff1d07c6ba66613c5c3645344c58b0ae73c5f6aacd37f23b51",
}

/**
 * @param config -
 * @param privateKey -
 * @param secret -
 */
async function redeem(config: HTLCConfig, privateKey: string, secret: Secret): Promise<void> {
  const htlc = new BitsharesHTLC("wss://testnet.dex.trading")
  await htlc.redeem(config, privateKey, secret)
}

redeem(config, privateKey, secret)
