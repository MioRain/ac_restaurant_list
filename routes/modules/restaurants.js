const express = require('express')
const translate = require('@vitalets/google-translate-api')
const Restaurant = require('../../models/Restaurant')
const getMapUrl = require('../../public/javascripts/get_mapURL')

const router = express.Router()

// search restaurant and sort
router.get('/search', (req, res) => {
  const { keyword, sort } = req.query
  const $regex = new RegExp(keyword.trim(), 'i')

  Restaurant.find({
    $or: [
      {
        name: $regex,
      }, {
        name_en: $regex,
      }, {
        category: $regex,
      }, {
        location: $regex
      }
    ],
  })
    .sort(sort)
    .lean()
    .then(restaurants => res.render('index', { restaurants, keyword }))
    .catch(error => console.error(error))
})

// browse restaurant detail
router.get('/:id', (req, res) => {
  const id = req.params.id
  const userId = req.user._id
  Restaurant.findOne({ id, userId })
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.error(error))
})

// render edit pag
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  const userId = req.user._id
  Restaurant.findOne({ id, userId })
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.error(error))
})

// create  new restaurant
router.post('/', (req, res) => {
  const restaurantOptions = req.body
  const tranObj = req.body.name
  const img = req.body.image

  restaurantOptions.userId = req.user._id

  // if no img use default img
  if (img === '') {
    restaurantOptions.image = `http://${req.get('host')}/images/default.png`
  }
  // get google map url by use getMapUrl to search name
  restaurantOptions.google_map = getMapUrl(tranObj)
  // get name_en by translate
  translate(tranObj, { to: 'en' })
    .then(name_en => {
      restaurantOptions.name_en = name_en.text
      Restaurant.find()
        .sort({ id: -1 })
        .limit(1)
        .then(info => restaurantOptions.id = info[0].id += 1)
        .then(() => Restaurant.create(restaurantOptions))
        .then(() => res.redirect('/'))
    })
    .catch(error => console.error(error))
})

// update restaurant info
router.put('/:id', (req, res) => {
  const restaurantOptions = req.body
  const id = req.params.id
  const tranObj = req.body.name
  const img = req.body.image
  const userId = req.user._id

  if (img === '') {
    restaurantOptions.image = `http://${req.get('host')}/images/default.png`
  }
  restaurantOptions.google_map = getMapUrl(tranObj)
  translate(tranObj, { to: 'en' })
    .then(name_en => {
      restaurantOptions.name_en = name_en.text
      Restaurant.findOne({ id, userId })
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
router.delete('/:id', (req, res) => {
  const id = req.params.id
  const userId = req.user._id
  Restaurant.findOne({ id, userId })
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

module.exports = router