// 載入框架、套件等
require('dotenv').config()
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const translate = require('translate-google')

const Restaurant = require('./models/Restaurant')
const getMapUrl = require('./public/javascripts/get_mapURL')

const app = express()
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))

// MongoDB 連線設定
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('MongoDB ERROR!')
})

db.once('open', () => {
  console.log('MongoDB connected!')
})

// 路由設計

// render index
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})


// search restaurant
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const $regex = new RegExp(keyword.trim(), 'i')
  Restaurant.find({
    $or: [
      {
        name: { $regex },
      }, {
        name_en: { $regex },
      }, {
        category: { $regex },
      }, {
        location: { $regex }
      }
    ],
  })
    .lean()
    .then(restaurants => res.render('index', { restaurants, keyword }))
})

// browse restaurant detail
app.get('/restaurants/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  Restaurant.findOne({ id })
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.error(error))
})


// server listen
app.listen(port, () => {
  console.log(`The Express server is running on http://localhost:${port}`)
})