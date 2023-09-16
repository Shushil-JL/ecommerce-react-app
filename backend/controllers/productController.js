const Product = require('../models/product')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const ApiFeatures = require('../utils/apiFeatures')

// Create product --Admin

exports.createProduct = catchAsyncErrors(async (req, res) => {
    req.body.user = req.user.id
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

// create new review or update review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    }

    const product = await Product.findById(productId)

    const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString())
    if (isReviewed) {
        product.reviews.forEach(rev => {
            if (rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating
                rev.comment = comment
            }
        })
    } else {
        product.reviews.unshift(review)
        product.numOfReviews = product.reviews.length
    }
    // average rating calulation
    let avgRating = 0
    product.reviews.forEach(rev => {
        avgRating += rev
    })
    product.ratings = avgRating / product.reviews.length //avg rating

    await product.save()
    res.status(200).json({
        success: true,
        message: "Thank You for your Feed back"
    })
})

// get all reviews of product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id)
    if (!product) {
        return next(new ErrorHandler("Product not Found", 404))
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

// delete review 
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId)
    if (!product) {
        return next(new ErrorHandler("Product doest not exist", 404))

    }
    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    )

    // average rating calulation
    let avgRating = 0
    reviews.forEach(rev => {
        avgRating += rev
    })
    const rating = avgRating / reviews.length //avg rating
    const numOfReviews = reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        rating,
        numOfReviews,
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message: "Review Deleted successfully"
    })
})