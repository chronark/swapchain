import ACCS from "./accs"

const argv = process.argv.slice(2)

if (argv.length !== 1) {
  console.log("Usage: node demo.js network")
  process.exit(1)
}
if (argv[0] !== "mainnet" && argv[0] !== "testnet") {
  console.log("swapchain-cli only supports mainnet and testnet")
  process.exit(1)
}

const accs = new ACCS(argv[0])
accs.main().then(() => {
  console.log("Success! Thanks for swapping with Swapchain.")
  console.log("Bye.")
  process.exit(0)
})
