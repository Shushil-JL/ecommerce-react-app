const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Yout Name"],
        maxLength: [30, "Name Cannot Exceed 30 Characters"],
        minLength: [4, "Name Should Have More Than 4 Characters"]

    },
    email: {
        type: String,
        required: [true, "Please Enter Your email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a Valid email"]
    },
    password: {
        type: String,
        required: true,
        minLength: [8, "Password should have at least 8 characters"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user",

    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
})
// password hashing
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

// compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// generating password reset token
userSchema.methods.getResetPasswordToken = function () {
    // generating token
    const resetToken = crypto.randomBytes(20).toString('hex')

    // hashing and adding to userSchema
    this.resetPasswordToken = crypto.
        createHash("sha256").
        update(resetToken).
        digest('hex')

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000
    return resetToken
}
module.exports = mongoose.model("User", userSchema)