const ErrorHandler = require('../utils/errorHandler')


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal Server Error"

    // wrong Mongodb Id error 
    if (err.name === 'CastError') {
        const message = `Resource not found ${err.path}`
        err = new ErrorHandler(message, 400)
    }

    // mongoose duplicate key errors
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErrorHandler(message, 400)
    }

    // wrong JWT error
    if (err.name === "jsonwebtokenError") {
        const message = `json web token in invalid, please try again`
        err = new ErrorHandler(message, 400)
    }

    // jwt expire error
    if (err.name === "TokenExpireError") {
        const message = `json web token in Expire, please try again`
        err = new ErrorHandler(message, 400)
    }

    res.status(err.statusCode).json({
        success: false,
        error: err.message,
        // error: err.stack
    })
}