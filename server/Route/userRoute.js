const express = require('express')
const router = express.Router()
const userController= require('../Controllers/userController')

const roleAccess = require("../Middleware/role").default


router.post('/register/admin' ,roleAccess("admin") ,userController.RegisterUser)
router.post('/register/employee' ,roleAccess("admin") ,userController.RegisterUser)
router.post('/login/employee' ,userController.LoginUser)

router.post('/login/admin' , userController.LoginUser)

router.post('/forgotPassword' , userController.forgotPassword)
router.put('/resetPassword', userController.resetPassword)

module.exports = router