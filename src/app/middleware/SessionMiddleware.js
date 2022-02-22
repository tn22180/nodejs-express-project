const shortid = require('shortid')
const Session = require('../models/Session')
module.exports = function(req, res, next)
{   
    if(!req.signedCookies.sessionId)
    {
        var sessionId = shortid.generate()
        res.cookie('sessionId', sessionId,{
            signed: true
        })
        Session.create({ _id: sessionId })
    }
    next()
}