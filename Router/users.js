const { User } = require("../Models/user")
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

router.get("/", async (req, res) => {
  const UserList =  await User.find().select("-passwordHash")

  if(!UserList) return res.status(500).send('no users found')
  res.send(UserList)
})

router.get('/:id', async (req, res)=> {
  const user = await User.findById(req.params.id).select("-passwordHash")
  if(!user) return res.status(500).send('there is no user with the given id')

  res.status(200).send(user)
}) 
router.get(`/get/count`, async (req, res) => {
  const userCount = await User.countDocuments()

  if(!userCount) return res.status(500).send('no product was found')
  res.send({count :userCount})
})

router.post("/", async(req, res)=> {
  let user = new User({
  name: req.body.name,
  email: req.body.email,
  passwordHash: bcrypt.hashSync(req.body.password, 10),
  phone: req.body.phone,
  isAdmin: req.body.isAdmin,
  street: req.body.street,
  apartment: req.body.apartment,
  zip: req.body.zip,
  city: req.body.city,
  country: req.body.country
  })
  user = await user.save()

  if(!user) return res.status(400).send('user cannot be created ')

  res.send(user)
})

router.post('/login' , async (req, res) => {
  const user = await User.findOne({email:req.body.email})
  const secret = process.env.secret

  if(!user) return res.status(400).send('User not found')

  if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin
      }, 
      secret, 
      {expiresIn: "1d"}
    )
    res.status(200).send({user: user.email, token: token})
  } else { return res.status(400).send('Email or Password incorrect')}
})

router.post("/register", async(req, res)=> {
  let user = await User.findOne({email: req.body.email})
  if(user) return res.status(400).send('user already registered') 

  user = new User({
  name: req.body.name,
  email: req.body.email,
  passwordHash: bcrypt.hashSync(req.body.password, 10),
  phone: req.body.phone,
  isAdmin: req.body.isAdmin,
  street: req.body.street,
  apartment: req.body.apartment,
  zip: req.body.zip,
  city: req.body.city,
  country: req.body.country
  })
  user = await user.save()

  if(!user) return res.status(400).send('user cannot be created ')

  res.send(user)
})

router.delete('/:id', (req,res)=> {
  User.findByIdAndRemove(req.params.id).then(user => {
    if(user) return res.status(200).send({message: 'user found and deleted' })
    else return res.status(404).send('no user found')
  }).catch(err => {
    return res.status(400).send(err)
  })
})
module.exports = router