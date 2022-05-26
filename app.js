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

// create new restaurant
app.post('/restaurants', (req, res) => {
  const restaurantOptions = req.body
  const tranObj = req.body.name
  const img = req.body.image
  // if no img use default img
  if (img === '') {
    restaurantOptions.image = `http://localhost:${port}/images/default.png`
  }
  // find max id in collections
  Restaurant.find({}).sort({ id: -1 }).limit(1)
    .then(info => restaurantOptions.id = info[0].id += 1)
    // get name_en by translate
    .then(() => translate(tranObj, { to: 'en', except: ['a'] })
      .then(res => restaurantOptions.name_en = res))
    // get google map url by use getMapUrl to search name
    .then(() => restaurantOptions.google_map = getMapUrl(tranObj))
    // create new restaurant to MongoDB
    .then(() => Restaurant.create(restaurantOptions))
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  Restaurant.findOne({ id })
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.error(error))
})

app.post('/restaurants/:id', (req, res) => {
  const restaurantOptions = req.body
  const id = req.params.id
  const tranObj = req.body.name
  const img = req.body.image

  // if no img use default img
  if (img === '') {
    restaurantOptions.image = `http://localhost:${port}/images/default.png`
  }

  Restaurant.findOne({ id })
    .then(info => {
      translate(tranObj, { to: 'en', except: ['a'] })
        .then(res => {
          restaurantOptions.name_en = res
          restaurantOptions.google_map = getMapUrl(tranObj)
          Object.keys(restaurantOptions).forEach(key => {
            info[key] = restaurantOptions[key]
          })
          return info.save()
        })
        .then(() => res.redirect(`/restaurants/${id}`))
    })
    .catch(error => console.error(error))
})

// delete restaurant
app.post('/restaurants/:id/delete', (req, res) => {
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