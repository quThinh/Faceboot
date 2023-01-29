const express = require('express')
const router = express.Router()
const utils = require('../controllers/utils')

router.get('/bg_colors',utils.getAllBgColors);

module.exports = router
