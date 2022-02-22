const Session = require('../models/Session')
const Product = require('../models/Product')

class CartControllers{
   addToCart(req, res, next)
   {
      const productId = req.params.id
      const sessionId = req.signedCookies.sessionId
      if(!sessionId)
      {
         res.redirect('/')
         return
      }
      Session.findOne({_id: sessionId})
            .then(session => {
                var count = session.get('cart.'+productId)||0;
                session.set('cart.'+productId, count + 1)
                session.save();
               var totalProducts = 0;
               for (let [key, value] of Object.entries(session.get('cart'))) {
                  totalProducts += value;
               }
               // res.locals.count = totalProducts

               Product.find({})
                  .then(products => res.render('home',{products,totalProducts}))   
                  .catch(next)
            })
            .catch(next)
   }
    
}
module.exports = new CartControllers()