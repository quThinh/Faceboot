const express = require('express')
const router = express.Router()

const { authByToken } = require('../middleware/auth')

const ArticleController = require('../controllers/articles')

router.get('/articles', ArticleController.getAllArticles)
router.post('/articles',authByToken ,ArticleController.createArticle)
router.put('/articles/:id', authByToken,ArticleController.updateArticle)
router.get('/articles/:id', ArticleController.getDetailArticleById)
router.post('/articles/report',authByToken, ArticleController.reportArticle)

router.get('articles/user/:id', ArticleController.getAllArticles)
router.post('/articles/report/:id', ArticleController.getAllArticles)
router.get('/articles/report/:id', ArticleController.getAllArticles)
router.post('/articles/censor/:id', ArticleController.getAllArticles)

module.exports = router