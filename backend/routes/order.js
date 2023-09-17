const express = require('express')
const {
    newOrder,
    getOrderDetails,
    myOrders,
    getAllOrders,
    upateOrder,
    deleteOrder
} = require('../controllers/orderController')


const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth')


const router = express.Router()

router.route('/order/new').post(isAuthenticatedUser, newOrder)

router.route('/order/:id').get(isAuthenticatedUser, getOrderDetails)

router.route('/orders/my').get(isAuthenticatedUser, myOrders)

router.route('/admin/orders').get(isAuthenticatedUser, authorizedRoles('admin'), getAllOrders)

router.route('/admin/order/:id').
    put(isAuthenticatedUser, authorizedRoles('admin'), upateOrder).
    delete(isAuthenticatedUser, authorizedRoles('admin'), deleteOrder)


module.exports = router