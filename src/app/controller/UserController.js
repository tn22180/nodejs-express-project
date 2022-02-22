const md5 = require('md5')
const User = require('../models/User')
const { body, validationResult } = require('express-validator')

class UserControllers{
    // [GET] /
    register(req, res, next)
    {
        res.render('user/create')
        next()
    }
    create(req, res, next)
    {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         res.render('user/create',{ errors: errors.array(),
         values: req.body });
         return;
        }
        
        const user = new User(req.body)
        user.password = md5(req.body.password)
        user.save()
            .then((user) => res.redirect('/user/'+user.slug))
            .catch(next)

    }
    show(req, res, next)
    {
        User.findOne({slug: req.params.slug})
            .then(user => {
                res.render('user/show',{user})
            })
            .catch(next)
    }
}
module.exports = new UserControllers()