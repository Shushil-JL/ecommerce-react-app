const express = require('express')
const {
    registerUser,
    getAllUser,
    loginUser,
    logoutUser,
    forgotPassword
} = require('../controllers/userController')

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/users').get(getAllUser)
router.route('/login').post(loginUser)
router.route('/forgot/password').post(forgotPassword)
router.route('/logout').get(logoutUser)

module.exports = router