
const express = require('express')
const { Product } = require('../Models/product')
const { Category } = require('../Models/category')
const mongoose = require('mongoose')
const multer = require('multer')
const router = express.Router()
const mkdir =  require('fs/promises');


const FILE_TYPE_MAP = {
  'image/png' : 'png',
  'image/jpeg' : 'jpeg',
  'image/jpg' : 'jpg'
}

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype]
    let uploadError = new Error('invalid image type')
    if (isValid){
      uploadError = null
    }
    try {
      await mkdir('public');
      await mkdir('public/uploads');
    } catch (error) {
      // do nothing if folder exists
    }
    cb(uploadError, 'public/uploads')

    
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.replace(' ', '-')
    const extension = FILE_TYPE_MAP[file.mimetype]
    cb(null, `${fileName}-${Date.now()}.${extension}` )
  }
})

const uploadOptions = multer({ storage: storage })



router.get(`/`, async (req, res)=> {
  let filter = {}

  if(req.query.categories) filter = {category : req.query.categories.split(',')}

  const productList = await Product.find(filter).populate('category')

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

router.get(`/get/featured/:count`, async (req, res) => {
  const count = req.params.count ? req.params.count : 0
  const products = await Product.find({isFeatured: true}).limit(+count)

  if(!products) return res.status(500).send("false")
  res.send(products)
})

router.post(`/`,uploadOptions.single('image'),  async (req,res) => {
  const category = await Category.findById(req.body.category)
  if(!category) return res.status(400).send('invalid category')

  const file = req.file
  if(!file) return res.status(400).send('no image in the request')

  const fileName = file.filename
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
  console.log(req.protocol)

  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`,
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

router.put(
  '/gallery-images/:id',
 uploadOptions.array('image', 10), 
 async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).send('invalid product id')

  const files = req.files 
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
  const imagePaths = `${basePath}${files}`
  // if(files)
  //update product
  const product = await Product.findByIdAndUpdate(req.params.id, 
  {
    images: imagePaths
  }, {new: true})
  if(!product) return res.status(500).send('product cannot be updated')

  res.status(200).send(product)
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