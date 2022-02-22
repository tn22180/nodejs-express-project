const User = require('../models/User')

module.exports.requireAuth = function(req, res, next)
{   
    
    if(!req.signedCookies.userId)
    {   
        res.redirect('/authentication/login')
        return
    }
    User.findOne({ _id: req.signedCookies.userId })
        .then(user => {
            if(!user)
            {
                res.redirect('/authentication/login')
                return 
            }
            res.locals.user = user
        })
        .catch(next)
    next();
    
}