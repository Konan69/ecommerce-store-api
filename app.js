const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
require('dotenv').config()
const port = 3000

const api = process.env.API_URL

app.use(express.json()) 
app.use(morgan('tiny'))

mongoose.connect('mongodb+srv://konan:12345@cluster.fgzm0i9.mongodb.net/cluster?retryWrites=true&w=majority')

app.get(`${api}/products`, (req, res)=> {
  const product = {
    id: 1,
    name: 'hair dresser',
    image: 'url'
  }
  res.send(product)
})



app.listen(port, () => console.log(`server runnning on port ${port}`))