const express = require('express')
const { createProduct, updateProduct, deleteProduct, getProductDetails, getProducts } = require('../controllers/productController')
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth')

const router = express.Router()

router.route('/products').get(getProducts)
router.route('/admin/product/new').post(isAuthenticatedUser, authorizedRoles('admin'), createProduct)
router.route('/admin/product/:id').
    put(isAuthenticatedUser, authorizedRoles('admin'), updateProduct).
    delete(isAuthenticatedUser, authorizedRoles('admin'), deleteProduct)
router.route('product/:id').get(getProductDetails)

module.exports = router