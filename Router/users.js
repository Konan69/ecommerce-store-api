const { User } = require("../Models/user")
const express = require('express')
const router = express.Router()

router.get("/", async (req, res) => {
  const UserList = await User.find()

  if(!UserList) return res.status(500).send('no users found')
  res.send(UserList)
})

module.exports = router