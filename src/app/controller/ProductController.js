const Product = require('../models/Product')
const path = require('path')
const { body, validationResult } = require('express-validator');

class ProductControllers{
    // [GET] /product/:slug
   show(req, res, next){
    Product.find({slug: req.params.slug})
       .then(product => res.render('product/show', {product}))
       .catch(next)

   }
    // [GET] /product/:slug
    search(req, res, next){
      const q = req.query.q;
      Product.find({name: new RegExp(q)})
         .then(products => res.render('home', {products,q}))
         .catch(next)
     }
    // [GET]/product/create   
   create(req, res){
        res.render('product/create')
   }
//    [POST]/product/store   
   store(req, res, next){
     
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         res.render('product/create',{ errors: errors.array(),
            values: req.body });
         }
      req.body.img = req.file.path.split('/').slice(7).join('/');
      const product = new Product(req.body)
       product.save()
            .then((product) => res.redirect('/product/'+product.slug))
            .catch(next)
   }
//    [GET]/product   
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
         .then(([products,countDeleted]) => res.render('product/main',{
            countDeleted,
            products:products.slice(start,end),
            limit,
            currentPage,
            count: products.length
         }))
         .catch(next)
   }
//    [GET]/product/:id/edit   
   edit(req, res, next)
   {
        Product.findById(req.params.id)
            .then(product => res.render('product/edit',{product}))
            .catch(next)
   }
//    [PUT]/product/:id  
   update(req, res, next)
   {
        Product.updateOne({_id: req.params.id}, req.body)
            .then(() => res.redirect('/product'))
            .catch(next)
   }
   // [DELETE]/product/:id
   delete(req, res, next)
   {
        Product.delete({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next)
   }
    // [DELETE]/product/:id/force
   forceDelete(req, res, next)
   {
        Product.deleteOne({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next)
   }
   // [GET]/product/trash
   trash(req, res, next)
   {
        Product.findDeleted({})
            .then(products => res.render('product/trash', {products}))
            .catch(next)
   }
     // [PATCH]/product/:id/restore
   restore(req, res, next)
   {
      Product.restore({_id: req.params.id})
         .then(() => res.redirect('back'))
         .catch(next)
   }
    // [POST]/product/handle-form-action
    handleFormAction(req, res, next)
    {
      switch(req.body.action){
         case 'delete':
            Product.delete({_id: {$in: req.body.productId}})
               .then(() => res.redirect('back'))
               .catch(next)
            break
         case 'restore':
            Product.restore({_id: {$in: req.body.productId}})
               .then(() => res.redirect('back'))
               .catch(next)
            break
         case 'forceDelete':
            Product.deleteMany({_id: {$in: req.body.productId}})
               .then(() => res.redirect('back'))
               .catch(next)
            break
         default:
            res.json({message : 'Action is invalid'})
      }
    }
}
module.exports = new ProductControllers()