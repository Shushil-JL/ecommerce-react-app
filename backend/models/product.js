const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Product Name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please enter product descriptions"]
    },
    price: {
        type: Number,
        required: [true, "plese enter product price"],
        maxLength: [8, "price cannot exceed 8 characters"]
    },
    rating: {
        type: Number,
        default: 0,
    },
    image: [{
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true
        }
    }],
    category: {
        type: String,
        required: [true, "please enter product category"]
    },
    stock: {
        type: Number,
        required: [true, "plese enter product stock"],
        maxLength: [4, "stock cannot exceed 4 figure"],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model("Product", productSchema)