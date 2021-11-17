const express = require('express')
const router = express.Router()
const db = require('../models')

router.get('/toolCreate', (req, res)=>{
  res.render('toolRequest/toolCreate')
})

router.post('/toolCreate', (req, res)=>{
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
    // res.redirect('/')
  })
})

module.exports = router