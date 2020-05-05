import app from "./app"
const port = process.env.PORT || 3000

/**
 * Start API and listen at port
 */
app.listen(port, () => {
  console.log(`app is running on port :${port}`)
})
