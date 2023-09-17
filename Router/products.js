
const express = require('express')
const { Product } = require('../Models/product')
const { Category } = require('../Models/category')
const mongoose = require('mongoose')
const router = express.Router()



router.get(`/`, async (req, res)=> {
  const productList = await Product.find().populate('category')

  if(!productList) return res.status(500).send({success:false})
  res.send(productList)
})

router.get(`/:id`, async (req, res)=> {
  const productId = await Product.findById(req.params.id).populate('category')

  if(!productId) return res.status(500).send('no product with that id was found')
  res.send(productId)
})

router.get(`/get/count`, async (req, res) => {
  const productCount = await Product.countDocuments()

  if(!productCount) return res.status(500).send('no product was found')
  res.send({count :productCount})
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

router.put('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).send('invalid product id')

  // validate category 
  const category = await Category.findById(req.body.category)
  if(!category) return res.status(400).send('invalid category')

  //update product
  const product = await Product.findByIdAndUpdate(req.params.id, 
  {
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
  }, {new: true})
  if(!product) return res.status(500).send('product cannot be updated')

  res.status(200).send(product)
})

router.delete('/:id', (req,res)=> {
  Product.findByIdAndRemove(req.params.id).then(product => {
    if(product) return res.status(200).send({message: 'product found and deleted' })
    else return res.status(404).send('no product found')
  }).catch(err => {
    return res.status(400).send(err)
  })
})


module.exports = router