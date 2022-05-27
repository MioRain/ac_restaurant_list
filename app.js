// 載入框架、套件等
require('dotenv').config()
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const translate = require('translate-google')
const methodOverride = require('method-override')

const Restaurant = require('./models/Restaurant')
const getMapUrl = require('./public/javascripts/get_mapURL')

const app = express()
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

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
app.use(methodOverride('_method'))

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
    .catch(error => console.error(error))
})

// browse restaurant detail
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findOne({ id })
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.error(error))
})

// render edit pag
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  Restaurant.findOne({ id })
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.error(error))
})

// create  new restaurant
app.post('/restaurants', (req, res) => {
  const restaurantOptions = req.body
  const tranObj = req.body.name
  const img = req.body.image

  // if no img use default img
  if (img === '') {
    restaurantOptions.image = `http://localhost:${port}/images/default.png`
  }
  // get google map url by use getMapUrl to search name
  restaurantOptions.google_map = getMapUrl(tranObj)
  // get name_en by translate
  translate(tranObj, { to: 'en', except: ['a'] })
    .then(name_en => {
      restaurantOptions.name_en = name_en
      Restaurant.find().sort({ id: -1 }).limit(1)
        .then(info => restaurantOptions.id = info[0].id += 1)
        .then(() => Restaurant.create(restaurantOptions))
        .then(() => res.redirect('/'))
    })
    .catch(error => console.error(error))
})

// update restaurant info
app.put('/restaurants/:id', (req, res) => {
  const restaurantOptions = req.body
  const id = req.params.id
  const tranObj = req.body.name
  const img = req.body.image

  if (img === '') {
    restaurantOptions.image = `http://localhost:${port}/images/default.png`
  }
  restaurantOptions.google_map = getMapUrl(tranObj)
  translate(tranObj, { to: 'en', except: ['a'] })
    .then(name_en => {
      restaurantOptions.name_en = name_en
      Restaurant.findOne({ id })
        .then(info => {
          Object.keys(restaurantOptions).forEach(key => {
            info[key] = restaurantOptions[key]
          })
          info.save()
            .then(() => res.redirect(`/restaurants/${id}`))
        })
    })
    .catch(error => console.error(error))
})

// delete restaurant
app.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findOne({ id })
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

// server listen
app.listen(port, () => {
  console.log(`The Express server is running on http://localhost:${port}`)
})