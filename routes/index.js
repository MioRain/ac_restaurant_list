const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')
const auth = require('./modules/auth')
const { authenticator } = require('../middleware/auth')  // 掛載 middleware

router.use('/users', users)
router.use('/restaurants', authenticator, restaurants) // 加入驗證程序
router.use('/auth', auth)
router.use('/', authenticator, home) // 加入驗證程序

module.exports = router