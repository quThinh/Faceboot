const express = require('express')
const router = express.Router()
const ReactionController = require('../controllers/reactions')
const { authByToken } = require('../middleware/auth')

router.get('/:article_id/reactions', ReactionController.getAllReactionOfArticles)                        //Get the comments for an article. 
router.post('/:article_id/reactions/:id', authByToken,ReactionController.postReaction)                //Create a comment for an article. 

module.exports = router