
const express = require('express')
const { Product } = require('../Models/product')
const { Category } = require('../Models/category')
const router = express.Router()

router.get(`/`, async (req, res)=> {
  const productList = await Product.find()

  if(!productList) return res.status(500).send({success:false})
  res.send(productList)
})

router.get(`/:id`, async (req, res)=> {
  const productId = await Product.findById(req.params.id)

  if(!productId) return res.status(500).send('no product with that id was found')
  res.send(productId)
})


router.post(`/`, async (req,res) => {
  const category = await Category.findById(req.body.category)
  if(!category) return res.status(400).send('invalid category')

  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReveiws: req.body.numReveiws,
    isFeatured: req.body.isFeatured,
  }) 
    const createdProduct = await product.save()
    if(!createdProduct) return res.status(500).send('the product cannot be created')
    res.status(201).send(createdProduct)
})

module.exports = router