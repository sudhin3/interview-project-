const mongoose = require('mongoose')

const cart = mongoose.Schema({
    cart : {
        type : Array
    }
})

const model = mongoose.model('cart' , cart)
module.exports = model