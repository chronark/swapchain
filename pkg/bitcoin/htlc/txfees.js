/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const fetch = require("node-fetch")
const response = require("express")

const getFees = async () => {
  const response = await fetch("https://blockstream.info/api/fee-estimates")
  const fees = await response.json()
  return fees
}

const callback = async () => {
  const feeEstimates = await getFees()
  console.log(feeEstimates)
  const arr = Object.values(feeEstimates)
  const min = Math.min(...arr)
  const max = Math.max(...arr)
  const transactionSize1 = 138 // lower size, input-1 output-1
  const transactionSize2 = 172 // higher size, input-1 output-2
  let minFee = 0
  let maxFee = 0
  const transactionVersion = transactionSize2 // based on the size of the transaction

  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  switch (transactionVersion) {
    case transactionSize1:
      // code block
      minFee = min * transactionSize1
      maxFee = max * transactionSize1
      console.log(`Min fee: ${minFee} SAT, max fee: ${maxFee} SAT`)
      readline.question(`What fees do you want?`, (answer) => {
        if (minFee <= answer && answer <= maxFee) console.log(`Your fee is set at  ${answer} SAT!`)
        else console.log(`Please choose a value between the min and max fee`)
        readline.close()
      })

      return { minFee, maxFee }

    case transactionSize2:
      // code block
      minFee = min * transactionSize2
      maxFee = max * transactionSize2
      console.log(`Min fee: ${minFee} SAT, max fee: ${maxFee} SAT`)
      readline.question(`What fees do you want?`, (answer) => {
        if (minFee <= answer && answer <= maxFee) console.log(`Your fee is set at  ${answer} SAT!`)
        else console.log(`Please choose a value between the min and max fee`)
        readline.close()
      })

      return { minFee, maxFee }
  }
}
callback()

module.exports = getFees
module.exports = callback
