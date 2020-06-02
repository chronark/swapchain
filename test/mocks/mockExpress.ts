import express from "express"

interface ReqRes {
  req: express.Request
  res: express.Response
}

/**
 * Mocks a request and response to use in unit tests.
 *
 * @returns - {req, res} object
 * @param payload - Payload object for the POST request.
 */
export function mockExpress(payload: Record<string, string>): ReqRes {
  const mockExpressReq = (): express.Request => {
    const req: express.Request = express.request
    req.body = payload
    return req
  }

  const mockExpressRes = (): express.Response => {
    const res: express.Response = express.response

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    res.status = jest.fn().mockImplementation((code: number): express.Response => res)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    res.json = jest.fn().mockImplementation((body?: any): express.Response => res)
    return res
  }

  return {
    req: mockExpressReq(),
    res: mockExpressRes(),
  }
}
