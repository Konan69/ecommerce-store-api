const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
require('dotenv').config()
const port = 3000
const api = process.env.API_URL

// middleware 
app.use(express.json()) 
app.use(morgan('tiny'))

mongoose.connect(process.env.CONNECTION_STRING)
.then(()=> console.log('connected to db'))
.catch((err)=> console.log(err))

const productSchema = new mongoose.Schema({
  name: String,
  image: String,
  countInStock: Number
})

const Product = mongoose.model('Product', productSchema)

app.get(`${api}/products`, (req, res)=> {
  const product = {
    id: 1,
    name: 'hair dresser',
    image: 'url'
  }
  res.send(product)
})

app.post(`${api}/products`, async (req,res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock
  })

  try {
    const createdProduct = await product.save()
    res.status(201).send(createdProduct)
  } catch (error) {
    res.sendStatus(500)
    console.log(err)
  }
  
})


app.listen(port, () => console.log(`server runnning on port ${port}`))