const md5 = require('md5')
const Product = require('../models/Product')
const User = require('../models/User')

class AuthenticationControllers{
    // [GET] /
    login(req, res, next)
    {
        res.render('authentication/login')
        next()
    }
    logout(req, res)
    {
        res.clearCookie('userId')
        res.redirect('/')
    }
    postLogin(req, res, next)
    {
        User.findOne( { email: req.body.email } )
            .then((user) => {
                if(!user){
                    res.render('authentication/login', {
                        errors: [ 'User does not exist.'
                        ],
                        values: req.body
                    })
                    return;
                }
                const password = req.body.password
                const hashedPassword = md5(password)
                if(user.password !== hashedPassword)
                {
                    res.render('authentication/login', {
                        errors: [ 'Wrong password'
                        ],
                        values: req.body
                    })
                    return;
                }
                res.cookie('userId', user._id,{
                    withCredentials: true,
                    signed: true
                })
                res.redirect('/product')
                

            })
            .catch(next)
    }
}
module.exports = new AuthenticationControllers()