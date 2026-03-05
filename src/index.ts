import express from "express"
import identifyRoute from "./routes/identifyRoute"
const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())

app.use("/identify", identifyRoute)
app.get("/", (req, res) => {
  res.json({
    msg: "BiteSpeed Identity Reconciliation API running"
  }).status(200)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})