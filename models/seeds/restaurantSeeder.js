require('dotenv').config()
const mongoose = require('mongoose')
const Restaurant = require('../Restaurant')
const restaurantList = require('../../restaurant.json').results

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', () => {
  console.log('MongoDB ERROR!')
})

db.once('open', () => {
  console.log('Creating seeds......')

  Restaurant.create(restaurantList)
  
  console.log('Done!')
})