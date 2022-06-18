const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/Restaurant')

router.get('/', (req, res) => {
  const userId = req.user._id  // 變數設定
  Restaurant.find({ userId })  // 加入查詢條件
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

module.exports = router