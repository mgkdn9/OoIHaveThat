const express = require('express')
const router = express.Router()
const db = require('../models')

router.get('/new', (req, res)=>{
  //View for new toolRequests
  res.render('toolRequest/new')
})

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

router.delete('/:id', (req, res)=>{
  console.log('this is the id:\n', req.params.id)
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

router.get('/:id', (req, res)=>{
  const toolId = req.params.id
  db.toolRequest.findOne({
    where: {
      id: toolId
    }
  })
  .then(foundTool => {
    console.log('This tool was selected for edit:\n',foundTool.dataValues)
    res.render('toolRequest/edit',{tool: foundTool.dataValues})
  })
})

//Edit buttons in profile take here
router.put('/:id', (req, res)=>{
  const toolId = req.params.id
  //Find the tool
  db.toolRequest.findOne({
    where: {
      id: toolId
    }
  })
  .then(foundTool => {
    // console.log('updating this tool (old values):\n',foundTool.dataValues)
    //Update and take back to profile
    foundTool.update({
      title:            req.body.title,
      timeNeeded:       req.body.timeNeeded,
      pictureURL:       req.body.pictureURL,
      // userId:           req.body.userId, DONT NEED
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
    // console.log('This tool was selected for response:\n',foundTool.dataValues)
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

module.exports = router