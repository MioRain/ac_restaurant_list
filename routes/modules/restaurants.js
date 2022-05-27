const express = require('express')
const translate = require('translate-google')
const Restaurant = require('../../models/Restaurant')
const getMapUrl = require('../../public/javascripts/get_mapURL')

const router = express.Router()

// search restaurant
router.get('/search', (req, res) => {
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
router.get('/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findOne({ id })
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.error(error))
})

// render edit pag
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  Restaurant.findOne({ id })
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.error(error))
})

// create  new restaurant
router.post('/', (req, res) => {
  const restaurantOptions = req.body
  const tranObj = req.body.name
  const img = req.body.image

  // if no img use default img
  if (img === '') {
    restaurantOptions.image = `http://localhost:3000/images/default.png`
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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findOne({ id })
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

module.exports = router