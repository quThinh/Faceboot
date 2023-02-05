const Article = require('../models/Article')
const User = require('../models/User')
const Comment = require('../models/Comments')
const Notification = require('../models/Notification')
const { v4, uuid } = require('uuidv4')
const NotificationChange = require('../models/NotificationChanges')
const NotificationObject = require('../models/NotificationObject')

module.exports.getAllNotification = async (req, res) => {
    try {
        if (!req.user.email) {
            res.status(401);
            throw new Error("Authentication")
        }

        const notifications = await Notification.findAll({
            include: [
                {
                    model: NotificationObject, attributes: ["notification_type", "create_at", "ArticleId"]
                },
            ],
            where: {
                UserEmail: req.user.email
            }
        })

        console.log(notifications)
        res.status(201).json({ notifications })
    } catch (e) {
        const code = res.statusCode ? res.statusCode : 422
        return res.status(code).json({
            errors: { body: ['Could not get notification', e.message] }
        })
    }
}

module.exports.deleteNotification = async (req, res) => {
    try {
        const notification_id = req.params.noti_id
        const email = req.user.email

        var notification = await Notification.findOne({ where: { id: notification_id } })
        if (!notification) {
            res.status(404)
            throw new Error("Not found notification")
        }

        if (email != notification.UserEmail) {
            res.status(403)
            throw new ErrorEvent("Authorization")
        }

        await Notification.destroy({ where: { id: notification_id } })
        res.status(200).json({ "message": "Notification deleted successfully" })
    } catch (e) {
        const code = res.statusCode ? res.statusCode : 422
        return res.status(code).json({
            errors: { body: ['Could not get notification', e.message] }
        })
    }
}

