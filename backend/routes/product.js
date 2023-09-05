const express = require('express')
const { getProduct } = require('../controllers/controller')

const router = express.Router()

router.route('/products').get(getProduct)
module.exports = router