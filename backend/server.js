const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const task = require("./routes/task")
const authRoutes = require('./routes/auth')

const app = express()
require('dotenv').config()

app.use(cookieParser())


// تفعيل CORS مع إرسال الكوكيز
app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true
}))

app.use(express.json())

app.use('/', authRoutes)
app.use('/', task)

mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is Ready to take off ${process.env.PORT}`)
    })
  })
  .catch((error) => {
    console.log("Database connection error:", error)
  })
