// 載入框架、套件等
require('dotenv').config()
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Restaurant = require('./models/Restaurant')
const restaurantList = require('./restaurant.json')

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

app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const regex = new RegExp(keyword.trim(), 'i')
  const restaurants = Restaurant.find((restaurant) => {
    const searchItems = [restaurant.name, restaurant.name_en, restaurant.category]
    for (let i in searchItems) {
      if (searchItems[i].match(regex)) return true
    }
  })
  res.render('index', { restaurants, keyword })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  Restaurant.findOne({ id })
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.error(error))
})

app.listen(port, () => {
  console.log(`The Express server is running on http://localhost:${port}`)
})