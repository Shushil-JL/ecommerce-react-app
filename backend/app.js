const express = require('express')
const errorHandler = require('./middleware/error')
const cookieParser = require('cookie-parser')

const app = express()
app.use(express.json())
app.use(cookieParser())

// Routes import 
const products = require('./routes/product')
const user = require('./routes/user')
const order = require('./routes/order')

app.use('/api/v1', products)
app.use('/api/v1', user)
app.use('/api/v1', order)

// middleware for error 
app.use(errorHandler)

module.exports = app