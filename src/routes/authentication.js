var express = require('express')
var router = express.Router()

const authenticationControllers = require('../app/controller/AuthenticationController');

router.post('/login', authenticationControllers.postLogin)

router.use('/login', authenticationControllers.login)

router.use('/logout', authenticationControllers.logout)



module.exports = router
