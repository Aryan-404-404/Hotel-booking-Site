const express = require('express')
const app = express()
const connectDB = require("./config/connectDB")
const dotenv = require("dotenv").config();
const cors = require('cors');
const port = process.env.PORT || 5000

connectDB();

app.use(express.json());
app.use(cors());
app.use('/user', require("./Routes/userRoutes"));
app.use('/book', require("./Routes/bookingRoutes"));

app.get('/', (req, res) => {
  res.send('Hotel booking system')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
