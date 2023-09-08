const express = require('express')
const { createProduct, updateProduct, deleteProduct, getProductDetails, getProducts } = require('../controllers/productController')
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth')

const router = express.Router()

router.route('/products').get(getProducts)
router.route('/product/new').post(isAuthenticatedUser, authorizedRoles('admin'), createProduct)
router.route('/product/:id').
    put(isAuthenticatedUser, authorizedRoles('admin'), updateProduct).
    delete(isAuthenticatedUser, authorizedRoles('admin'), deleteProduct).
    get(getProductDetails)

module.exports = router