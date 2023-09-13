const User = require('../models/user')
const ErrorHandler = require('../utils/errorHandler')
const sendToken = require('../utils/sendJWTtoken')
const sendEmail = require('../utils/sendEmail')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const crypto = require('crypto')
const user = require('../models/user')



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
// reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    // creating hash token 
    const resetPasswordToken = crypto.
        createHash("sha256").
        update(req.params.token).
        digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler("Reset Password Token is Invalid or is Expired", 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("New password and confirm password does not match", 400))
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()
    sendToken(user, 200, res)
})


exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        user
    })
})

// update user password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {

    const { oldPassword, confirmPassword, newPassword } = req.body

    const user = await User.findById(req.user.id).select('+password')

    const isPasswordMatch = await user.comparePassword(oldPassword)
    if (!isPasswordMatch) {
        return next(new ErrorHandler("Old Password is incorrect", 400))
    }
    if (newPassword !== confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400))
    }
    user.password = newPassword
    await user.save()

    sendToken(user, 200, res)
})

// update user profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

    const data = {
        name: req.body.name,
        email: req.body.email,
        // we will use cloudinary later
    }
    const user = await User.findByIdAndUpdate(req.user.id, data, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        message: "Profile Updated successfully"
    })
})

// get all users ---(admin)
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find()
    res.status(200).json({
        success: true,
        users,
    })
})

// get user details ---(admin)
exports.getUserInfo = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true,
        user,
    })
})

// update user roles ---(admin)
exports.updateRole = catchAsyncErrors(async (req, res, next) => {

    const data = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }
    const user = await User.findByIdAndUpdate(req.params.id, data, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        message: "Profile Updated successfully"
    })
})

// delete user---(admin)
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id)
    if (!user) {
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`, 404))

    }
    await user.deleteOne()
    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    })
})