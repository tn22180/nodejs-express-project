const Product = require('../models/Product')

class SiteControllers{
    // [GET] /
    index(req, res, next)
    {
        Product.find({})
            .then(products => res.render('home', {products}))
            .catch(next)
            
    }
    about(req, res, next)
    {
        res.render('about')
    }
}
module.exports = new SiteControllers()