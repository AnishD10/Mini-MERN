const employeeController = require('../Controllers/employController')
const express = require('express')
const router = express.Router()
const roleAccess = require("../Middleware/role").default
const userController = require('../Controllers/userController')


router.post('/',roleAccess('admin'),employeeController.CreateEmployee)
router.post('/login/employee' , userController.LoginUser)

module.exports = router