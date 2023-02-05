const express = require('express')
const router = express.Router()
const NotificationController = require('../controllers/notification')
const { authByToken } = require('../middleware/auth')

router.get('/', authByToken, NotificationController.getAllNotification)                //Create a comment for an article. 
router.delete('/:noti_id', authByToken, NotificationController.deleteNotification)

module.exports = router