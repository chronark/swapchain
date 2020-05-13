import express from "express"
/**
 * toUpper transforms a string to upper case and returns it.
 *
 * It will return a HTTP/400 error for empty strings or empty payloads.
 *
 * @param req - The incoming express Request
 * @param res - The outgoing express Response
 */
export const toUpper = (req: express.Request, res: express.Response): void => {
  if (typeof req.body.text === "undefined" || req.body.text === "") {
    res.status(400)
    res.json({ error: "You must specify 'text' in the request body" })
    return
  }

  res.json(
    JSON.stringify({
      capitalizedText: req.body.text.toUpperCase(),
    }),
  )
}
