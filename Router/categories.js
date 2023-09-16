const {Category} = require('../Models/category');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) =>{
  const categoryList = await Category.find();

  if(!categoryList) {
      res.status(500).json({success: false})
  } 
  res.status(200).send(categoryList);
})

module.exports =router;