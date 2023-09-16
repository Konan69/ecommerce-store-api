const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const { Product } = require('./Models/product')
require('dotenv').config()

const port = 3000
const api = process.env.API_URL


// middleware 
app.use(express.json()) 
app.use(morgan('tiny'))


// routes

const productRouter = require('./Router/products')
const usersRouter = require('./Router/users')
const categoriesRouter = require('./Router/categories')
const ordersRouter = require('./Router/orders')
 
app.use(`${api}/products`, productRouter)
app.use(`${api}/orders`, ordersRouter)
app.use(`${api}/categories`, categoriesRouter)
app.use(`${api}/users`, usersRouter)

// db connect 
mongoose.connect(process.env.CONNECTION_STRING)
.then(()=> console.log('connected to db'))
.catch((err)=> console.log(err))

//sever 
app.listen(port, () => console.log(`server runnning on port ${port}`))