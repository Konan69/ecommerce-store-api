const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const { Product } = require('./Models/product')
require('dotenv').config()
const port = 3000
const api = process.env.API_URL

const productRouter = require('./Router/products')

// middleware 
app.use(express.json()) 
app.use(morgan('tiny'))
app.use(`${api}/products`, productRouter)

mongoose.connect(process.env.CONNECTION_STRING)
.then(()=> console.log('connected to db'))
.catch((err)=> console.log(err))




app.listen(port, () => console.log(`server runnning on port ${port}`))