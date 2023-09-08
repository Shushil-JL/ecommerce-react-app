const User = require('../models/user')
const ErrorHandler = require('../utils/errorHandler')
const sendToken = require('../utils/sendJWTtoken')
const sendEmail = require('../utils/sendEmail')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')



// register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body

    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: "sample public id",
            url: "sampleUrl"
        }
    })

    sendToken(user, 201, res)

})

// login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(new ErrorHandler("Please enter email & password", 400))
    }
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
        return next(new ErrorHandler("User does not exist", 401))
    }

    const isPasswordMatch = await user.comparePassword(password)
    if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    sendToken(user, 200, res)
})
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {

    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "loggedout successfully"
    })
})

// forgotPassword
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
        return next(new ErrorHandler("User not found", 404))
    }
    // get reset token
    const resetToken = user.getResetPasswordToken()
    await user.save({ validateBeforeSave: false })

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/reset/${resetToken}`
    const message = `Your password reset token is :- \n\n${resetPasswordUrl}\n\nIf you have not requested this email then, just ignore it`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Ecommerce password recovery',
            message

        })
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })

    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({ validateBeforeSave: false })

        return next(new ErrorHandler(error.message, 500))
    }

})

// get all users
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find()
    res.status(200).json({
        success: true,
        users,
    })
})