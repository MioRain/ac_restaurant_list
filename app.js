// 載入框架、套件等
require('dotenv').config()
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
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
  res.render('index', { restaurants: restaurantList.results })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  const regex = new RegExp(keyword, 'i')
  const restaurants = restaurantList.results.filter((restaurant) => {
    const searchItems = [restaurant.name, restaurant.name_en, restaurant.category]
    for (let i in searchItems) {
      if (searchItems[i].match(regex)) return true
    }
  })
  res.render('index', { restaurants, keyword })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find((restaurant) => {
    return restaurant.id.toString() === req.params.restaurant_id
  })
  res.render('show', { restaurant })
})

app.listen(port, () => {
  console.log(`The Express server is running on http://localhost:${port}`)
})