const Order = require('../models/order')
const Product = require('../models/product')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')


exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,

    } = req.body

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id,
    })

    res.status(201).json({
        success: true,
        order
    })

})

// get order details
exports.getOrderDetails = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email")
    if (!order) {
        return next(new ErrorHandler("order does not exist", 404))
    }
    res.status(200).json({
        success: true,
        order
    })

})

// get own order details
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id })

    res.status(200).json({
        success: true,
        orders
    })

})

// get all orders ---admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find()

    let totalAmount = 0

    orders.forEach(order => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success: true,
        orders,
        totalAmount
    })

})

// update order status --- admin
exports.upateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("Order is already delivered", 400))
    }

    order.orderItems.forEach(async (item) => {
        await updateStock(item.product, item.quantity)
    })

    order.orderStatus = req.body.status
    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now()
    }
    await order.save({ validateBeforeSave: false })
    res.status(200).json({
        success: true,
        message: "order status updated"
    })
})
async function updateStock(id, quantity) {
    const product = await Product.findById(id)
    product.stock -= quantity
    await product.save({ validateBeforeSave: false })
}

// delete order status --- admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    if (!order) {
        return next(new ErrorHandler("Order does not exist", 404))
    }

    await order.deleteOne()

    res.status(200).json({
        success: true,
        message: "order deleted"
    })
})