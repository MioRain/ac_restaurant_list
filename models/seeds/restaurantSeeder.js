const db = require('../../config/mongoose')
const Restaurant = require('../Restaurant')
const restaurantList = require('../../restaurant.json').results

db.once('open', () => {
  console.log('Creating seeds......')

  Restaurant.create(restaurantList)

  console.log('Done!')
})

module.exports = db