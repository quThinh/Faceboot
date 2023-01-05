const express = require('express')
const router = express.Router()
const CommentController = require('../controllers/comments')
const { authByToken } = require('../middleware/auth')

router.get('/comments', CommentController.getAllComments)                        //Get the comments for an article. 
router.post('/comments', authByToken, CommentController.postNewComment)                //Create a comment for an article. 
router.delete('/comments/:id', authByToken, CommentController.deleteComment)     //Delete a comment for an article.
router.get('/comments/article/:id', authByToken, CommentController.getAllComments)     // Get all comments of an article
router.get('/comments/:id', authByToken, CommentController.getAllComments)             // Change a comment
router.put('/comments/:id', authByToken, CommentController.getAllComments)             // Update a comment

module.exports = router