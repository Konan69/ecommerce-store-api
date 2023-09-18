const { User } = require("../Models/user")
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

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

  if(!user) return res.status(400).send('User not found')

  if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
    res.status(200).send('User authenticated')
  } else { return res.status(400).send('Email or Password incorrect')}
})

module.exports = router