var express = require('express')
var router = express.Router()

const siteControllers = require('../app/controller/SiteController');

router.use('/about', siteControllers.about)

router.use('/', siteControllers.index)


module.exports = router
