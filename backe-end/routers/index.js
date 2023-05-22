const express = require('express')
const router = express()
const cart = require('../controller/cart')



router.route('/add_to_cart').post(cart.addToCart)

router.route('/fetch_cart_items').post(cart.fetchCart)

router.route('/order').post(cart.order_cart_item)

router.route('/fethcOrders').post(cart.fetchOrders)

module.exports = router

