const { default: mongoose } = require('mongoose')
const cartShema = require('../model/index')
const orderShema = require('../model/order')

exports.addToCart = async( req , res ) => {
    try {
        if(req.body.userdata) {
            let cart = await cartShema.findOne({_id : req.body.userdata})
            if(cart) {
                cartAvailable = cart.cart.findIndex((item) => item.item == req.body.item.name)
                if(cartAvailable != -1) {
                    cartShema.updateOne(
                        {_id : req.body.userdata , 'cart.item' : req.body.item.name},
                        {
                            $inc : 
                            {
                                'cart.$.quantity' : req.body.count
                            }
                        }).then((data) => {
                            res.status(200).json(data)
                        }).catch((err) => {
                            res.status(401).json(err)
                        })
                } else {
                    let cart = {
                        item : req.body.item.name ,
                        img : req.body.item.image ,
                        quantity : 1,
                        amount : req.body.item.price
                    }
                    cartShema.updateOne({_id : req.body.userdata} , 
                        {
                            $push : {
                                cart : cart
                            }
                }).then((data) => {
                        res.status(200).json(data)
                    }).catch((err) => {
                        res.status(401).json(err)
                    })
                }
            } else {
                let data = {
                cart : [{
                    item : req.body.item.name ,
                    img : req.body.item.image ,
                    quantity : 1,
                    amount : req.body.item.price
                }]
            }
            cartShema.create(data).then((data) => {
                req.session.userdata = data._id
                res.status(200).json(req.session.userdata)
            }).catch((err) => {
                res.status(401).json(err)
            })
            }
        } else {
            let data = {
                cart : [{
                    item : req.body.item.name ,
                    img : req.body.item.image ,
                    quantity : 1,
                    amount : req.body.item.price
                }]
            }
            cartShema.create(data).then((data) => {
                req.session.userdata =   data._id
                res.status(200).json(req.session.userdata)
            })
        }
    } catch (err) {
        res.status(401).json(err)
    }
}

exports.fetchCart  = async( req , res) => {
    try {
        let cart = await cartShema.findOne({_id : req.body.userid})
        if(cart) {
            res.status(200).json(cart)
        } else {
            res.status(200).json(null)
        }
    } catch (err) {
        res.status(401).json(err)
    }
}

exports.order_cart_item = async( req , res ) => {
    try {
        let cart = await cartShema.findOne({_id : req.body.userid})
        if(cart.cart.length > 0) {
            let totalAmount = 0
            let quantityOffer = false
            let totalQuantity = 0
            let bigOfferQuantity = false
            for(let i = 0 ; i < cart.cart.length ; i++) {
                totalAmount += (cart.cart[i].amount * cart.cart[i].quantity)
                totalQuantity +=cart.cart[i].quantity
                if(cart.cart[i].quantity > 10) {
                    quantityOffer = true
                }
                if(cart.cart[i].quantity > 15) {
                    bigOfferQuantity = true
                }
            }
            let total = totalAmount
            if(totalQuantity > 30 && bigOfferQuantity) {
                totalAmount = totalAmount / 2
            } else if(totalQuantity > 20){
                totalAmount = (totalAmount) - ((totalAmount * 10 ) / 100)
            } else if(quantityOffer) {
                totalAmount = (totalAmount) - ((totalAmount * 5 ) / 100)
            } else if(totalAmount > 200) {
                totalAmount = totalAmount - 10
            }
             let order = {
            cart : cart.cart ,
            userid : req.body.userid ,
            offer : totalAmount ,
            total
        }
        orderShema.create(order).then((data) => {
            cartShema.updateOne({_id : req.body.userid} , {$unset : {cart}}).then((data) => {
                res.status(200).json(data)
            }).catch((Err) => {
                res.status(401).json(Err)
            })
        }).catch((err) => {
            res.status(401).json(err)
        })

        } else {
            res.status(401).json("nothing in cart")
        }
       
    } catch (err) {
        res.status(401).json(err)
    }
}

exports.fetchOrders = ( req , res ) => {
    try {
        orderShema.find({userid : new mongoose.Types.ObjectId(req.body.userid)}).then((data) => {
            res.status(200).json(data)
        }).catch((err) => {
            res.status(401).json(err)
        })
    } catch (err) {
        res.status(401).json(err)
    }
}