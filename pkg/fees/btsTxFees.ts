 /**
 * Provides Bitshares transaction fees.
 *
 * @returns - Fixed BTS transaction fee.
 */
export async function getFeesBTS(): Promise<number> {
const btsFee = 0.04826
const transactionSize = 100
const totalFee = btsFee * transactionSize
 
return totalFee
}