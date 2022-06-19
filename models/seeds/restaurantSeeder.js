const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('../../config/mongoose')
const Restaurant = require('../Restaurant')
const User = require('../User')
const restaurantList = require('../../restaurant.json').results

const SEED_USERS = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678',
    restaurants: restaurantList.slice(0, 3)
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678',
    restaurants: restaurantList.slice(3, 6)
  }
]

db.once('open', () => {
  // 先創建 users
  return Promise.all(Array.from(SEED_USERS, seedUser => {
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(seedUser.password, salt))
      .then(hash => User.create({
        name: seedUser.name,
        email: seedUser.email,
        password: hash
      }))
      // 創建餐廳資料
      .then(user => {
        const userId = user._id
        return Promise.all(Array.from(seedUser.restaurants, restaurant => {
          restaurant.userId = userId
          return Restaurant.create(restaurant)
        }))
      })
  }))
    .then(() => {
      console.log('done')
      process.exit()
    })
    .catch(err => console.log(err))
})