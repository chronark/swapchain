/* eslint @typescript-eslint/no-explicit-any: 0 */

import fetch from "node-fetch"
import { mocked } from "ts-jest/utils"
/**
 * Implements a mock for node-fetch
 *
 * @param code - Status code for the response
 * @param payload - A serialized object
 */
export function mockFetch(code: number, payload: string): void {
  mocked(fetch).mockImplementation(
    (): Promise<any> => {
      return Promise.resolve({
        status: code,
        json() {
          return Promise.resolve(JSON.stringify(payload))
        },
      })
    },
  )
}
