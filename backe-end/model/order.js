const mongoose = require('mongoose')

const order = mongoose.Schema({
    cart : {
        type : Array ,
        require : true
    } ,
    userid : {
        type : mongoose.Types.ObjectId,
        require : true ,
    } ,
    offer : {
        type : Number ,
        require : true ,
    } ,
    total : {
        type : Number ,
        require : true
    }

})

const model = mongoose.model('order' , order)
module.exports = model