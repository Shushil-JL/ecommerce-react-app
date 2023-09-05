const Product = require('../models/product')

// Create product --Admin

exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body)
        res.status(201).json({
            success: true,
            message: "Procut created",
            product,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

// Get all products

exports.getProduct = async (req, res) => {

    try {
        const products = await Product.find()
        res.status(200).json({
            success: true,
            products
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })

    }

}
// Get product details 
exports.getProductDetails = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "product not found"
            })
        }
        res.status(200).json({
            success: true,
            product,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

// Update product ---Admin 

exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
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

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

// Delete product ---Admin
exports.deleteProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }
        product.deleteOne()
        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })

    }
}