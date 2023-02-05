const Article = require('../models/Article')
const User = require('../models/User')
const Notification = require('../models/Notification')
const Comment = require('../models/Comments')
const { uuid } = require('uuidv4')
const NotificationObject = require('../models/NotificationObject')
const NotificationChange = require('../models/NotificationChanges')

module.exports.postNewComment = async (req, res) => {
    try {
        const article_id = req.params.article_id
        const data = req.body.comment
        //Throw error if no data
        if (!data) {
            res.status(422)
            throw new Error('Comment is required')
        }

        if (!data.body) {
            res.status(422)
            throw new Error('Comment body is required')
        }

        //Find for article
        const article = await Article.findByPk(article_id)
        if (!article) {
            res.status(404)
            throw new Error('Article not found')
        }

        //Checking whthter this user has aldready posted a comment
        const existingComment = await Comment.findAll({ where: { UserEmail: req.user.email } })
        // if (existingComment.length > 0) {
        //     throw new Error('You aldready added a review')
        // }

        //Create new Comment
        const newUUID = uuid()
        const newComment = await Comment.create({ id: newUUID, content: data.body })

        //Find user
        const user = await User.findByPk(req.user.email)

        //assosiations
        user.addComments(newComment)
        article.addComments(newComment)

        //Send output
        newComment.dataValues.author = {
            email: user.dataValues.email,
            intro_txt: user.dataValues.intro_txt,
            avatar_url: user.dataValues.avatar_url,
        }
        author = await User.findOne({
            where: {
                email: article.UserEmail
            }
        })

        //Check notification exist

        // Notification
        const newNotificationObject = await NotificationObject.create({ notification_type: 101, create_at:Date.now()})
        const newNotificationChange = await NotificationChange.create({NotificationObjectId: newNotificationObject.dataValues.id, UserEmail: user.dataValues.email})
        const newNotification = await Notification.create({isSeen: false, NotificationObjectId: newNotificationObject.dataValues.id, UserEmail: author.dataValues.email})
        article.addNotificationObject(newNotificationObject)

        res.status(201).json({ newComment })

    } catch (e) {
        const code = res.statusCode ? res.statusCode : 422
        return res.status(code).json({
            errors: { body: ['Could not post comment', e.message] }
        })
    }
}

module.exports.getAllCommentsOfArticle = async (req, res) => {
    try {
        console.log("Here")
        const article_id = req.params.article_id

        //Find for article
        const article = await Article.findByPk(article_id)
        if (!article) {
            res.status(404)
            throw new Error('Article Id not valid')
        }

        const comments = await Comment.findAll({
            where: {
                ArticleId: article_id
            },
            include: [
                {
                    model: User,
                    attributes: ['email', 'intro_txt', 'avatar_url']
                }
            ]
        })

        res.status(201).json({ comments })

    } catch (e) {
        const code = res.statusCode ? res.statusCode : 422
        return res.status(code).json({
            errors: { body: ['Could not get all comment of article', e.message] }
        })
    }
}

module.exports.deleteComment = async (req, res) => {
    try {
        const article_id = req.params.article_id
        const idInfo = req.params.id
        //Find for article
        const article = await Article.findByPk(article_id)
        if (!article) {
            res.status(404)
            throw new Error('Article not found')
        }

        //Find for comment
        const comment = await Comment.findByPk(idInfo)
        if (!comment) {
            res.status(404)
            throw new Error('Comment not found')
        }

        //Check whether logged in user is the author of that comment
        if (req.user.email != comment.UserEmail && req.user.email != article.UserEmail) {
            res.status(403)
            throw new Error("You must be the author to modify this comment")
        }

        //Delete comment
        await Comment.destroy({ where: { id: idInfo } })
        res.status(200).json({ "message": "Comment deleted successfully" })

    } catch (e) {
        const code = res.statusCode ? res.statusCode : 422
        return res.status(code).json({
            errors: { body: ['Could not delete comment', e.message] }
        })
    }
}

module.exports.updateComment = async (req, res) => {
    try {
        const article_id = req.params.article_id;
        const idInfo = req.params.id

        // update data
        var data = req.body.comment;
        var content = data.content;

        // Find article
        const article = await Article.findByPk(article_id)
        if (!article) {
            res.status(404)
            throw new Error("Article not found")
        }

        //Find for comment
        const comment = await Comment.findByPk(idInfo)
        if (!comment) {
            res.status(404);
            throw new Error("Comment not found");
        }

        // Check authentication
        if (!req.user.email) {
            res.status(401);
            throw new Error("Authentication")
        }
        if (req.user.email != comment.UserEmail) {
            res.status(403);
            throw new Error("Authorization")
        }
        // Check article have this comment

        if (comment.ArticleId != Article.id) {
            res.status(404);
            throw new Error("Not found comment")
        }
        await comment.update({ idInfo, content })
        res.status(200).json({ comment })
    } catch (err) {
        const code = res.statusCode ? res.statusCode : 422
        return res.status(code).json({
            errors: { body: ['Could not update comment', err.message] }
        })
    }
}