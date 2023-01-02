const express = require('express')
const router = express.Router()

const { authByToken } = require('../middleware/auth')

const ArticleController = require('../controllers/articles')

// router.get('/',ArticleController.getAllArticles)                    //Get most recent articles from users you follow
// router.get('/feed',authByToken,ArticleController.getFeed)           //Get most recent articles globally
// router.post('/',authByToken,ArticleController.createArticle)        //Create an article
// router.get('/:slug',ArticleController.getSingleArticleBySlug)       //Get an article
// router.patch('/:slug',authByToken,ArticleController.updateArticle)  //Update an article 
// router.delete('/:slug',authByToken,ArticleController.deleteArticle) //Delete an article

router.get('/articles', ArticleController.getAllArticles)
router.post('/articles',authByToken ,ArticleController.createArticle)
router.put('/articles/:id', authByToken,ArticleController.updateArticle)
router.get('/articles/:id', ArticleController.getDetailArticleById)

router.get('articles/user/:id', ArticleController.getAllArticles)
router.post('/articles/report/:id', ArticleController.getAllArticles)
router.get('/articles/report/:id', ArticleController.getAllArticles)
router.post('/articles/censor/:id', ArticleController.getAllArticles)

module.exports = router