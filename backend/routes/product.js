const express = require('express')
const { createProduct, updateProduct, deleteProduct, getProductDetails, getProducts } = require('../controllers/productController')

const router = express.Router()

router.route('/products').get(getProducts)
router.route('/product/new').post(createProduct)
router.route('/product/:id').
    put(updateProduct).
    delete(deleteProduct).
    get(getProductDetails)

module.exports = router