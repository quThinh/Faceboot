const Article = require('../models/Article');
const User = require('../models/User');
const Reaction = require('../models/Reactions')
const sequelize = require('../dbConnection');
const { uuid } = require('uuidv4');

module.exports.postReaction = async (req, res) => {
    try {

        const article_id = req.params.article_id;
        data = req.body.reaction;
        if (!req.user.email) {
            res.status(401);
            throw new Error("Authentication")
        }
        console.log(data)
        if (!data) {
            res.status(422)
            throw new Error("No data")
        }

        const article = await Article.findByPk(article_id)
        if (!article) {
            res.status(404)
            throw new Error('Article not found')
        }
        // Check Reaction Exist
        const reaction = await Reaction.findOne({ where: {UserEmail: req.user.email, ArticleId: article_id } });
        if (reaction) {
            await reaction.update({id: reaction.id, react: data})
            res.status(201).json({ reaction })
        } else {

            var newUUID = uuid()
            const user = await User.findByPk(req.user.email)
            var newReaction = await Reaction.create({id: newUUID, react: data , ArticleId: article.id, UserEmail: user.email})

            //Send output
            newReaction.dataValues.author = {
                email: user.dataValues.email,
                intro_txt: user.dataValues.intro_txt,
                avatar_url: user.dataValues.avatar_url,
            }

            res.status(201).json({ newReaction })
        }

    } catch (err) {
        const code = res.statusCode ? res.statusCode : 422
        return res.status(code).json({
            errors: { body: ['Could not react article', err.message] }
        })
    }
}

module.exports.getAllReactionOfArticles = async (req, res) => {
    try {
        const article_id = req.params.article_id;

        const article = await Article.findByPk(article_id)
        if (!article) {
            res.status(404);
            throw new Error("Article not valid")
        }
        const reactions = await Reaction.findAll({
            where: {
                ArticleId: article_id,
            },
            include: [
                {
                    model: User,
                    attributes: ['email', 'intro_txt', 'avatar_url']
                }
            ]
        })

        res.status(201).json({reactions})
    } catch (err) {
        const code = res.statusCode ? res.statusCode : 422
        return res.status(code).json({
            errors: { body: ['Could not react article', err.message] }
        })
    }
}