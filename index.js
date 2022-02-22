
require('dotenv').config()
const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3000
const route = require('./src/routes')
const methodOverride = require('method-override')
const db = require('./src/config/db')
const SortMiddleware = require('./src/app/middleware/SortMiddleware')
const cookieParser = require('cookie-parser')
const sessionMiddleware = require('./src/app/middleware/SessionMiddleware')
db.connect();
//  template engine
app.use(cookieParser(process.env.SESSION_SECRET))
app.use(sessionMiddleware)
app.set('view engine', 'pug')
app.set('views',path.join(__dirname, 'src', 'resources','views') )
app.use(express.static(path.join(__dirname,'src', 'public')))
app.use(methodOverride('_method'))
app.use(express.urlencoded({
  extended: true
}))
app.use(express.json())


app.use(SortMiddleware)

// Route init
route(app);

  app.listen(PORT, () => {
    console.log(`Example app listening on`)
  })