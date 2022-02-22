var express = require('express')
const path = require('path')
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

const productApiControllers = require('../controller/ProductApiController');


router.use('/trash', productApiControllers.trash)

router.post('/store',upload.single('img'),
        body('name').not().isEmpty().withMessage('Please input name'),
        body('price').not().isEmpty().withMessage('Please input price'),
        body('description').not().isEmpty().withMessage('Please input description'),
        productApiControllers.store)

router.use('/search', productApiControllers.search)

router.post('/handle-form-action', productApiControllers.handleFormAction)

router.delete('/:id', productApiControllers.delete)

router.delete('/:id/force', productApiControllers.forceDelete)

router.patch('/:id/restore', productApiControllers.restore)

router.put('/:id', productApiControllers.update)

router.use('/:slug', productApiControllers.show)

router.use('/', productApiControllers.main)

module.exports = router
