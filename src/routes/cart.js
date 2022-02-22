var express = require('express')
var router = express.Router()

const cartControllers = require('../app/controller/CartController');

router.get('/add/:id', cartControllers.addToCart)

module.exports = router
