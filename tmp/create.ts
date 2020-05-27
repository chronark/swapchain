import BitsharesHTLC from "../srv/bitshares/htlc/btsHTLC"
import { getSecret, Secret } from "./secret"
import { HTLCConfig } from "../pkg/types/htlc"

const privateKey = "XXX"

const config = {
  sender: "amos",
  receiver: "amos2",
  amount: 1,
  asset: "TEST",
  time: 600,
}

const secret = getSecret(32)

/**
 * @param config -
 * @param privateKey -
 * @param secret -
 */
async function start(config: HTLCConfig, privateKey: string, secret: Secret): Promise<void> {
  const htlc = new BitsharesHTLC("wss://testnet.dex.trading")
  await htlc.create(config, privateKey, secret)
  console.log(secret)
}

start(config, privateKey, secret)
