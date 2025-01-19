const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const cookieParser = require('cookie-parser')
const app = express()
const connect = require('../User/db/db.js')
connect()
const userRoutes = require('./routes/user.routes')
const rabbitMq = require('./service/rabbit.js')
rabbitMq.connect()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use('/', userRoutes)

module.exports = app