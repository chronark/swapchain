import express from "express"
import fetch from "node-fetch"

/**
 * handler takes the request body and makes a call to the toUpper service with it.
 *
 * It will return toUpper's result and status code.
 *
 * @param req - The incoming express Request
 * @param res - The outgoing express Response
 */
export const handler = async (req: express.Request, res: express.Response): Promise<void> => {
  const port = 3000
  const params = {
    method: "POST",
    body: JSON.stringify(req.body),
    headers: { "Content-Type": "application/json" },
  }

  const resSrv = await fetch(`http://swapchain-srv-toupper:${port}/upper`, params)
  const json = await resSrv.json()
  const status = resSrv.status

  res.status(status)
  res.json(json)
}
