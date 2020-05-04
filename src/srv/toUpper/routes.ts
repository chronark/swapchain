import express from "express"

export const toUpper = (req: express.Request, res: express.Response) => {
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
