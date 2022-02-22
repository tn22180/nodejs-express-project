var express = require('express')
const { body, validationResult } = require('express-validator')
var router = express.Router()

const userControllers = require('../app/controller/UserController');

router.post('/create', 
body('email').not().isEmpty().withMessage('Please input name'),
body('email').isEmail().withMessage('This flield must be email'),
body('password').not().isEmpty().withMessage('Please input password'),
body('password').isLength({ min: 6 }).withMessage('Password must have 6 than character'),
body('name').not().isEmpty().withMessage('Please input name'),
body('img').not().isEmpty().withMessage('Please input link img'),
body('phone').not().isEmpty().withMessage('Please input phone'),
 userControllers.create)

router.use('/register', userControllers.register)

router.use('/:slug', userControllers.show)


module.exports = router
