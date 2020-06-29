  import server from "./server"
  import mongoose from "mongoose"
  
  const port = process.env.PORT || 3000
  const mongoPort = process.env.MONGO_PORT || 27017
  const dbName = process.env.DB_NAME || "test"
  const URI = process.env.MONGOURI  
  
  
  mongoose
    .connect(`mongodb+srv://Amos:Amos123@cluster0-fzwz4.mongodb.net/<dbname>?retryWrites=true&w=majority`, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
      console.log("MongoDB connected")
      server.listen(port, () => {
        console.log(`Listening on ${port}`)
      })
    })

    
       