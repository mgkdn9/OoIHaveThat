const express = require('express')
const router = express.Router()
const db = require('../models')

router.get('/new', (req, res)=>{
  //View for new toolRequests
  res.render('toolRequest/new')
})

//Insert new toolRequests into db
router.post('/new', (req, res)=>{
  db.toolRequest.create({
    title:            req.body.title,
    timeNeeded:       req.body.timeNeeded,
    pictureURL:       req.body.pictureURL,
    userId:           req.body.userId,
    priceFirstOffer:  req.body.priceFirstOffer
  })
  .then((post) => {
    res.redirect('/profile')
  })
  .catch((error) => {
    console.log(error)
    res.redirect('/profile')
  })
})

//Delete a toolRequest from profile page
router.delete('/:id', (req, res)=>{
  db.toolRequest.destroy({
    where: { id : req.params.id }
  })
  .then(deletedItem => {
    //destroy() returns 1 if deleted, 0 if nothing
    res.redirect('/profile')
  })
  .catch(error => 
    console.error
    )
})

//Render Edit toolRequest page
router.get('/:id', (req, res)=>{
  const toolId = req.params.id
  db.toolRequest.findOne({
    where: {
      id: toolId
    }
  })
  .then(foundTool => {
    res.render('toolRequest/edit',{tool: foundTool.dataValues})
  })
})

//Edit buttons in profile page take here
router.put('/:id', (req, res)=>{
  const toolId = req.params.id
  //Find the tool
  db.toolRequest.findOne({
    where: {
      id: toolId
    }
  })
  .then(foundTool => {
    //Update and take back to profile
    foundTool.update({
      title:            req.body.title,
      timeNeeded:       req.body.timeNeeded,
      pictureURL:       req.body.pictureURL,
      priceFirstOffer:  req.body.priceFirstOffer
    })
    res.redirect('/profile')
  })
})

//Respond button on home page takes here
router.get('/response/:id/:distance', (req, res) => {
  const toolId = req.params.id
  const distance = req.params.distance
  db.toolRequest.findOne({
    where: {
      id: toolId
    },
    include: [db.user]
  })
  .then(foundTool => {
    res.render('toolRequest/response',{tool: foundTool.dataValues, distance})
  })
})

//Create new response when they hit 'Submit Response'
router.post('/response/:toolId/:currentUserId', (req, res) => {
  const toolId        = req.params.toolId
  const currentUserId = req.params.currentUserId

  db.response.create({
    toolRequestId: toolId,
    userId: currentUserId,
    priceCounterOffer: req.body.priceCounterOffer
  })
  .then((post) => {
    res.redirect('/profile')
  })
  .catch((error) => {
    console.error
    res.redirect('/profile')
  })
})

//Delete response when they hit 'Delete Response'
router.delete('/response/:id', (req, res)=>{
  db.response.destroy({
    where: { id : req.params.id }
  })
  .then(deletedItem => {
    res.redirect('/profile')
  })
  .catch(error => 
    console.error
    )
})

module.exports = router