var express = require('express')
const path = require('path')
const authenticationMiddleware = require('../app/middleware/AuthenticationMiddleware')
const { body, validationResult } = require('express-validator')
const multer  = require('multer')
var router = express.Router()
const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            
            cb(null, path.resolve(__dirname, '../public/uploads')); 
           
        },
        filename: (req, file, cb) => {
            cb(null , file.originalname); // mặc định sẽ save name của hình ảnh
            // là name gốc, chúng ta có thể rename nó.  
        }
    })
    const upload = multer({storage:storage});

const productControllers = require('../app/controller/ProductController');

router.use('/create',authenticationMiddleware.requireAuth, productControllers.create)

router.use('/trash',authenticationMiddleware.requireAuth, productControllers.trash)

router.post('/store',authenticationMiddleware.requireAuth,upload.single('img'),
        body('name').not().isEmpty().withMessage('Please input name'),
        body('price').not().isEmpty().withMessage('Please input price'),
        body('description').not().isEmpty().withMessage('Please input description'),
        productControllers.store)

router.use('/search', productControllers.search)

router.post('/handle-form-action',authenticationMiddleware.requireAuth, productControllers.handleFormAction)

router.delete('/:id',authenticationMiddleware.requireAuth, productControllers.delete)

router.delete('/:id/force',authenticationMiddleware.requireAuth, productControllers.forceDelete)

router.use('/:id/edit',authenticationMiddleware.requireAuth, productControllers.edit)

router.patch('/:id/restore',authenticationMiddleware.requireAuth, productControllers.restore)

router.put('/:id',authenticationMiddleware.requireAuth, productControllers.update)

router.use('/:slug', productControllers.show)

router.use('/',authenticationMiddleware.requireAuth, productControllers.main)

module.exports = router
