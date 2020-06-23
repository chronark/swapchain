import {getFeesBTC} from "./BTCtxfees"
import fetch from 'node-fetch';
import { mocked } from 'ts-jest/utils';
 
jest.mock('node-fetch', () => {
  return jest.fn();
});
 
beforeEach(() => {
  mocked(fetch).mockClear();
});
 
describe('getfeeBTC test', () => {
  test('getfeeBTC should fetch a fee estimates with target blocks', async () => {
 
    // provide a mock implementation for the mocked fetch:
    mocked(fetch).mockImplementation((): Promise<any> => {
      return Promise.resolve({
        array() {
          return Promise.resolve([1,2,3,4,5]);
        }
      });
    });
 
    // getPeople uses the mock implementation for fetch:
    const data = await getFeesBTC();
    expect(mocked(fetch).mock.calls.length).toBe(1);
    expect(data).toEqual([1,2,3,4,5])
  });
});
 