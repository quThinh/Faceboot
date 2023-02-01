const express = require('express')
const router = express.Router()
const UserController = require('../controllers/users')
const {authByToken} = require('../middleware/auth')

router.post('/users/register',UserController.createUser)                     //Register a new user
router.post('/users/login',UserController.loginUser)                //Login for existing user
router.patch('/users/edit',authByToken,UserController.editUser)                //Edit user information
router.patch('/user/change-password',authByToken,UserController.changePassword)       //Changes password
router.get('/users',authByToken,UserController.getSpecificUser)       //get specific user from client
router.get('/users/:emailid',authByToken, UserController.getUserInfo)       //get specific user from client
router.patch('/users/set-block',authByToken,UserController.setBlock)       //set type block for client
router.get('/users/search/:name',authByToken,UserController.search)       //search when loggined
router.patch('/users/block/:user2',authByToken,UserController.blockUser)       //search when loggined
router.patch('/users/unblock/:user2',authByToken,UserController.unBlockUser)       //search when loggined
// router.get('/search',UserController.search)       //search when loggined
// router.get('/test', UserController.test)
module.exports = router