const Product = require('../models/product')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const ApiFeatures = require('../utils/apiFeatures')

// Create product --Admin

exports.createProduct = catchAsyncErrors(async (req, res) => {

    const product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        message: "Procut created",
        product,
    })
}
)

// Get all products

exports.getProducts = catchAsyncErrors(async (req, res) => {

    const resultPerpage = 5
    const productCount = await Product.countDocuments()

    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerpage)
    const products = await apiFeature.query
    res.status(200).json({
        success: true,
        products,
        productCount
    })

})
// Get product details 
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler("Product not found", 404))

    }
    res.status(200).json({
        success: true,
        product,
    })


})

// Update product ---Admin 

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        message: "Product Updated"
    })


})

// Delete product ---Admin
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }
    product.deleteOne()
    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })


})