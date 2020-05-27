import express from "express"
import BitsharesHTLC from "./htlc/btsHTLC"
import { SHA256 } from "crypto-js"
import { HTLCConfig } from "../../pkg/types/htlc"
import { getSecret } from "../../tmp/secret"
/**
 * handlerHTLC handles HTLC create or redeem requests.
 *
 * It will return a HTTP/400 error for empty request bodies. //TODO
 *
 * @param req - The incoming express Request
 * @param res - The outgoing express Response
 */
export async function handlerHTLC(req: express.Request, res: express.Response): Promise<void> {
  // TODO: Implement errorhandler
  if (
    typeof req.body.method === "undefined" ||
    req.body.method === "" ||
    typeof req.body.params === "undefined" ||
    req.body.params === {}
  ) {
    res.status(400)
    res.json({ error: "Invalid request body" })
    return
  }

  const config: HTLCConfig = {
    sender: req.body.params.from,
    receiver: req.body.params.to,
    amount: req.body.params.amount,
    asset: req.body.params.asset,
    time: req.body.params.time,
  }

  const htlc = new BitsharesHTLC(req.body.params.node)

  if (req.body.method === "htlc_create") {
    const preimage = getSecret(32)

    await htlc.create(config, req.body.params.privateKey, preimage)

    res.json(
      JSON.stringify({
        status: "HTLC created!",
        secret: preimage.secret,
      }),
    )
  } else if (req.body.method === "htlc_redeem") {
    const preimage = {
      secret: req.body.params.secret,
      hash: SHA256(req.body.params.secret).toString(),
    }

    await htlc.redeem(config, req.body.params.privateKey, preimage)

    res.json(
      JSON.stringify({
        status: "HTLC redeemed!",
      }),
    )
  } else {
    res.status(400)
    res.json({ error: "Invalid method" })
  }
}
