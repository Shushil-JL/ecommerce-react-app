const express = require('express')
const {
    registerUser,
    getAllUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    getUserDetails,
    updatePassword,
    updateProfile,
    getUserInfo,
    updateRole,
    deleteUser
} = require('../controllers/userController')

const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth')

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/forgot/password').post(forgotPassword)
router.route('/reset/password/:token').put(resetPassword)
router.route('/update/password').put(isAuthenticatedUser, updatePassword)
router.route('/update/profile').put(isAuthenticatedUser, updateProfile)

router.route('/logout').get(logoutUser)

router.route('/me').get(isAuthenticatedUser, getUserDetails)
router.route('/admin/users').get(isAuthenticatedUser, authorizedRoles('admin'), getAllUser)

router.route('admin/user/:id').
    get(isAuthenticatedUser, authorizedRoles('admin'), getUserInfo).
    put(isAuthenticatedUser, authorizedRoles('admin'), updateRole).
    delete(isAuthenticatedUser, authorizedRoles('admin'), deleteUser)

module.exports = router