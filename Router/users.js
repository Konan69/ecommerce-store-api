const { User } = require("../Models/user")
const express = require('express')
const router = express.Router()

router.get("/", async (req, res) => {
  const UserList = await User.find()

  if(!UserList) return res.status(500).send('no users found')
  res.send(UserList)
})

router.post("/", async(req, res)=> {
  let user = new User({
  name: req.body.name,
  email: req.body.email,
  passwordHash: req.body.passwordHash,
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

module.exports = router