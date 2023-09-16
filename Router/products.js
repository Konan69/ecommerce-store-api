
const express = require('express')
const { Product } = require('../Models/product')
const router = express.Router()

router.get(`/`, async (req, res)=> {
  const productList = await Product.find()

  if(!productList) return res.status(500).send({success:false})
  res.send(productList)
})

router.post(`/`, async (req,res) => {
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

module.exports = router