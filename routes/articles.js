const express = require('express')
const router = express.Router()

const { authByToken } = require('../middleware/auth')

const ArticleController = require('../controllers/articles')

router.get('/articles', ArticleController.getAllArticles)
router.post('/articles',authByToken ,ArticleController.createArticle)
router.patch('/articles/:id', authByToken,ArticleController.updateArticle)
router.get('/articles/:id', ArticleController.getDetailArticleById)
router.post('/articles/report',authByToken, ArticleController.reportArticle)
router.get('/articles/:articleId/:userEmail', authByToken, ArticleController.getArticleDetail)
router.delete('/articles/:articleId', authByToken, ArticleController.deleteArticle)
router.post('/articles/search/keyword=?', ArticleController.deleteArticle)

// router.post('/articles/censor/:id', ArticleController.getAllArticles)

module.exports = router