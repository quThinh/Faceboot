const express = require('express')
const router = express.Router()
const FriendController = require('../controllers/friends')
const { authByToken } = require('../middleware/auth')

router.post('/friends/send-request-friend/:receiveUser', authByToken, FriendController.sendRequest)                 
router.get('/friends/all-request', authByToken, FriendController.getAllRequest)             
router.get('/friends/all-be-request', authByToken, FriendController.getAllBeRequest)             
router.patch('/friends/set-accept/:emailId', authByToken, FriendController.acceptRequest)           
router.patch('/friends/cancel-request/:emailId', authByToken, FriendController.cancelRequest)     
// router.get('/friends/set-remove', authByToken, FriendController.removeRequest)       
router.get('/friends/list', authByToken, FriendController.getAllFriend)      
router.get('/friends/list/:emailId', FriendController.getAllFriendUser)     
router.get('/friends/recommend',authByToken , FriendController.recommendFriend)       //search when loggined
// router.get('/friends/get-recommends', authByToken, FriendController.getAllRecommend)       

module.exports = router