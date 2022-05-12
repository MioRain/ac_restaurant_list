const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  const restaurants = restaurantList.results.filter((restaurant) => {
    const searchItems = [restaurant.name, restaurant.name_en, restaurant.category]
    for (let i in searchItems) {
      if (searchItems[i].toLowerCase().includes(keyword)) return true
    }
  })
  res.render('index', { restaurants, keyword })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find((restaurant) => {
    return restaurant.id.toString() === req.params.restaurant_id
  })
  res.render('show', { restaurant })
})

app.listen(port, () => {
  console.log(`Express is listening on localhost:%{port}`)
})