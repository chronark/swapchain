import ACCS from "../accs/accs"
import figlet from "figlet"
import { getUserInput } from "./getUserInput"

// Print beautiful Swapchain banner and version info
figlet("Swapchain", (err, banner) => {
  if (err) {
    throw new Error(err.toString())
  }
  console.log(banner)
})

new Promise((resolve) => setTimeout(resolve, 500)).then(() => {
  console.log("")
  console.log("version: sprint-12-release")
  console.log("Welcome to swapchain-cli.")
  console.log("")

  getUserInput()
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
