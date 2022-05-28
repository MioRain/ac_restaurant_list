const db = require('../../config/mongoose')
const Restaurant = require('../Restaurant')
const restaurantList = require('../../restaurant.json').results

db.once('open', () => {
  console.log('Creating seeds......')

  Restaurant.create(restaurantList)
    .then(() => {
      console.log("restaurantSeeder done!")
    })
    .catch(err => console.log(err))
    .finally(() => db.close())
})

module.exports = db