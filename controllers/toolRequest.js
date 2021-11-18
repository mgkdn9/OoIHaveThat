const express = require('express')
const router = express.Router()
const db = require('../models')

router.get('/new', (req, res)=>{
  res.render('toolRequest/new')
})

router.post('/new', (req, res)=>{
  db.toolRequest.create({
    timeNeeded:       req.body.timeNeeded,
    pictureURL:       req.body.pictureURL,
    userId:           req.body.userId,
    priceFirstOffer:  req.body.priceFirstOffer
  })
  .then((post) => {
    res.redirect('/')
  })
  .catch((error) => {
    console.log(error)
    res.redirect('/')
  })
})

router.delete('/:id', (req, res)=>{
  console.log('!!!!!!!!!!!!!!!!!!!!!!!this is the id:\n', req.params.id)
  db.toolRequest.destroy({
    where: { id : req.params.id }
  })
  .then(deletedItem => {
    //destroy() returns 1 if deleted, 0 if nothing
    // console.log('you deleted: ',deletedItem)
    res.redirect('/profile')
  })
  .catch(error => 
    console.error
    )
})

module.exports = router