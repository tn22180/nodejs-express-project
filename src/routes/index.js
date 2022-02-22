const siteRouter = require('./site')
const productRouter = require('./product')
const userRouter = require('./user')
const authenticationRouter = require('./authentication')
const cartRouter = require('./cart')
const productApi = require('../api/routes/productApi')
function route(app)
{
    app.use('/product', productRouter)

    app.use('/user', userRouter)

    app.use('/cart', cartRouter)

    app.use('/api/product', productApi)

    app.use('/authentication', authenticationRouter)

    app.use('/', siteRouter)
}
module.exports = route;