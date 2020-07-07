import ACCS from "../web/src/accs/accs"
import figlet from "figlet"
import { getUserInput } from "./getUserInput"
import readline from "readline"

const read = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const argv = process.argv.slice(2)

if (argv.length !== 1) {
  console.error("Usage: node index.js network")
  process.exit(1)
}
if (argv[0] !== "mainnet" && argv[0] !== "testnet") {
  console.error("swapchain-cli only supports mainnet and testnet")
  process.exit(1)
}

// Print beautiful Swapchain banner and version info
figlet("Swapchain", (err, banner) => {
  if (err) {
    throw new Error(err.toString())
  }
  console.log(banner)
})

new Promise((resolve) => setTimeout(resolve, 500)).then(() => {
  console.log("")
  console.log("version: sprint-11-release")
  console.log("Welcome to swapchain-cli.")
  console.log("")

  getUserInput(read)
    .then((fields) => {
      ACCS.run(fields).then(() => {
        console.log("Success! Thanks for swapping with Swapchain.")
        console.log("Bye.")
        process.exit(0)
      })
    })
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
})
