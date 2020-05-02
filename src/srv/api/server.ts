import { app } from "./index"
const port = 3000

/**
 * Start API and listen at port
 */
app.listen(port, () => {
  console.log(`API listening on port ${port}`)
})
