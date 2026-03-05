import express from "express"
import identifyRoute from "./routes/identifyRoute"

const app = express()

app.use(express.json())

app.use("/identify", identifyRoute)
app.get("/", (req, res) => {
  res.json({
    msg: "BiteSpeed Identity Reconciliation API running"
  }).status(200)
})
app.listen(3000, () => {
  console.log("Server running on port 3000")
})