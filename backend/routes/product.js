const express = require('express')
const { getProduct, createProduct, updateProduct, deleteProduct, getProductDetails } = require('../controllers/controller')

const router = express.Router()

router.route('/products').get(getProduct)
router.route('/product/new').post(createProduct)
router.route('/product/:id').
    put(updateProduct).
    delete(deleteProduct).
    get(getProductDetails)

module.exports = router