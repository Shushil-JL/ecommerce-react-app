const express = require('express')
const errorHandler = require('./middleware/error')

const app = express()
app.use(express.json())

// Routes import 
const products = require('./routes/product')

app.use('/api/v1', products)

// middleware for error 
app.use(errorHandler)

module.exports = app