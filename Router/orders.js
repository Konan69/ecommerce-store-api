const {Order} = require('../Models/order');
const express = require('express');
// const { OrderItem } = require('../models/order-item');
const router = express.Router();


router.get(`/`, async (req, res) =>{
  const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});

  if(!orderList) {
      res.status(500).json({success: false})
  } 
  res.send(orderList);
})


module.exports =router;