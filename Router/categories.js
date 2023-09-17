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


router.get('/:id', async (req, res)=> {
  const category = await Category.findById(req.params.id)
  if(!category) return res.status(500).send('there is no category with the given id')

  res.status(200).send(category)
})

router.put('/:id', async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, 
  {
    name:req.body.name,
    icon: req.body.icon,
    color: req.body.color
  })
  if(!category) return res.status(500).send('there is no category with the given id')

  res.status(200).send(category)
})

router.post(`/`, async (req,res )=> {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color
  })
  category = await category.save()

  if(!category) return res.status(404).send('the category cannot be created')

  res.send(category)
}) 
// api/vi/id
router.delete('/:id', (req,res)=> {
  Category.findByIdAndRemove(req.params.id).then(category => {
    if(category) return res.status(200).send({message: 'category found and deleted' })
    else return res.status(404).send('no category found')
  }).catch(err => {
    return res.status(400).send(err)
  })
})
module.exports =router;