const express = require('express')
const router = express.Router()
const CommentController = require('../controllers/comments')
const { authByToken } = require('../middleware/auth')

router.get('/:article_id/comments', CommentController.getAllCommentsOfArticle)                        //Get the comments for an article. 
router.post('/:article_id/comments/', authByToken, CommentController.postNewComment)                //Create a comment for an article. 
router.delete('/:article_id/comments/:id/', authByToken, CommentController.deleteComment)     //Delete a comment for an article.
router.put('/:article_id/comments/:id/', authByToken, CommentController.updateComment)             // Update a comment

module.exports = router