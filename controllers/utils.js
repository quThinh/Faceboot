const Article = require('../models/Article')
const User = require('../models/User')
const Comment = require('../models/Comments')
const { uuid } = require('uuidv4')
const BgColor = require('../models/BackgroundColor')

module.exports.getAllBgColors = async (req, res) => {
    try {
        //Find for article
        const bgcolor = await BgColor.findAll();
        if (!bgcolor.length) {
            res.status(404)
            throw new Error('BackGround Color not exist')
        }

        res.status(201).json(bgcolor)
    } catch (e) {
        const code = res.statusCode ? res.statusCode : 422
        return res.status(code).json({
            errors: { body: ['Could not get background color', e.message] }
        })
    }
}
