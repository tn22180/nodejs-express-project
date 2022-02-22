const Product = require('../../app/models/Product')
const path = require('path')
const { body, validationResult } = require('express-validator');

class ProductControllers{
    // [GET] /api/product/:slug
   show(req, res, next){
    Product.find({slug: req.params.slug})
       .then(product => res.json(product))
       .catch(next)

   }
    // [GET] /api/product/:slug
    search(req, res, next){
      const q = req.query.q;
      Product.find({name: new RegExp(q)})
         .then(products => res.json(products))
         .catch(next)
     }
//    [POST]/api/product/store   
   store(req, res, next){
      const product = new Product(req.body)
       product.save()
            .then((product) => res.json(product))
            .catch(next)
   }
//    [GET]/api/product   
   main(req, res, next)
   {  
      var currentPage = 1;
      const page = parseInt(req.query.page) || 1
      currentPage = page
      const limit = 8;
      const start = (page-1) * limit
      const end = page*limit
      let productQuery = Product.find({})
      if(req.query.hasOwnProperty('_sort'))
      {
         const isValidType = ['asc', 'desc'].includes(req.query.type)
         productQuery = productQuery.sort({
            [req.query.column] : isValidType ? req.query.type : 'desc'
         })
      }
      Promise.all([ productQuery, Product.countDocumentsDeleted()])
         .then(([products,countDeleted]) => res.json(products))
         .catch(next)
   }
//    [PUT]/api/product/:id  
   update(req, res, next)
   {
        Product.updateOne({_id: req.params.id}, req.body)
            .then((product) => res.json(product))
            .catch(next)
   }
   // [DELETE]/api/product/:id
   delete(req, res, next)
   {
        Product.delete({_id: req.params.id})
            .then(() => res.json({message:"Deleted"}))
            .catch(next)
   }
    // [DELETE]/api/product/:id/force
   forceDelete(req, res, next)
   {
        Product.deleteOne({_id: req.params.id})
            .then(() => res.json({message:"Deleted"}))
            .catch(next)
   }
   // [GET]/api/product/trash
   trash(req, res, next)
   {
        Product.findDeleted({})
            .then(products => res.json(products))
            .catch(next)
   }
     // [PATCH]/api/product/:id/restore
   restore(req, res, next)
   {
      Product.restore({_id: req.params.id})
         .then((products) => res.json(products))
         .catch(next)
   }
    // [POST]/api/product/handle-form-action
    handleFormAction(req, res, next)
    {
      switch(req.body.action){
         case 'delete':
            Product.delete({_id: {$in: req.body.productId}})
               .then(() => res.json({message: "Items have been removed"}))
               .catch(next)
            break
         case 'restore':
            Product.restore({_id: {$in: req.body.productId}})
               .then(() => res.json({message: "Items have been restored"}))
               .catch(next)
            break
         case 'forceDelete':
            Product.deleteMany({_id: {$in: req.body.productId}})
               .then(() => res.json({message: "Items have been force deleted"}))
               .catch(next)
            break
         default:
            res.json({message : 'Action is invalid'})
      }
    }
}
module.exports = new ProductControllers()