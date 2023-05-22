const express = require('express')
const app = express()
const mongoose = require('mongoose')
const index = require('./routers/index')
const session = require('express-session')
const {v4:uuidv4} = require('uuid')
const  cookieParser = require('cookie-parser');
const cors = require('cors')



// session
app.use(session({
  secret: uuidv4(),
  resave: false,
  saveUninitialized: true ,
  cookie: { maxAge: 6000000000 },
}));

app.use(cors({
  origin : 'http://localhost:3000'
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended : true}))
mongoose.connect('mongodb://0.0.0.0:27017/sudhi' , {})

 app.use('/' , index)

 app.listen(3001 , () => {
    console.log("Server is running");
 })