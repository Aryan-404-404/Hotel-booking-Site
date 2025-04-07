const express = require('express')
const app = express()
const connectDb = require("./config/connectDB")
const dotenv = require("dotenv").config();

const port = process.env.PORT || 5000
connectDb();

app.use(express.json());
app.use('/user', require("./Routes/userRoutes"));
app.use('/book', require("./Routes/bookingRoutes"));
app.use('/rooms', require("./Routes/roomRoutes"));

app.get('/', (req, res) => {
  res.send('Hotel booking system')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})