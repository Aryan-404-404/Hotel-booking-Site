const express = require('express')
const app = express()
const connectDb = require("./config/connectDB")
const dotenv = require("dotenv").config();

const port = process.env.PORT || 5000
connectDb();

app.use(express.json());
app.use('/user', require("./Routes/userRoutes"));

app.get('/', (req, res) => {
  res.send('Hotel booking system')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})