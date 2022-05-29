// 載入框架、套件等
require('./config/mongoose')
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const Restaurant = require('./models/Restaurant')
const routes = require('./routes')

const app = express()
const PORT = process.env.PORT || 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

// 路由設計
app.use(methodOverride('_method'))
app.use(routes)

// server listen
app.listen(PORT, () => {
  console.log(`The Express server is running on http://localhost:${PORT}`)
})