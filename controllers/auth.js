const express = require('express')
const router = express.Router()
const db = require('../models')
const passport = require('../config/ppConfig.js')
const axios = require('axios');
require('dotenv').config()
// MapBox API
const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: MAPBOX_ACCESS_TOKEN });
    

router.get('/signup', (req, res)=>{
    res.render('auth/signup')
})

router.post('/signup', (req, res)=>{
    // Use request to call the API
    const geocodeQuery = req.body.address
    geocodingClient.forwardGeocode({query: geocodeQuery})
    .send()
    //apiResponse contains latitude and longitude for the provided address
    .then(apiResponse => {
        db.user.findOrCreate({
            where: {email: req.body.email},
            defaults: {
                name: req.body.name,
                phone: req.body.phone,
                password: req.body.password,
                latitude: apiResponse.body.features[0].center[1],
                longitude: apiResponse.body.features[0].center[0]
            }
        })
        .then(([createdUser, wasCreated])=>{
            if(wasCreated){
                console.log(`just created the following user:`, createdUser)
                // res.send('POST form data from signup.ejs, then redirect')
                passport.authenticate('local', {
                    successRedirect: '/', // !-> FLASH <-!
                    successFlash: 'Account created and logged in!'
                })(req, res) // why does this need to be an IIFE???
            } else { // !-> FLASH <-!
                req.flash('error', 'email already exists, try logging in') 
                // console.log('An account associated with that email address already exists! Did you mean to login?')
                res.redirect('/auth/login')
            }
        })
        .catch(err =>{ // !-> FLASH <-!
            req.flash('error', err.message) 
            res.redirect('/auth/signup')
        })
    })
})

//Render login page
router.get('/login', (req, res)=>{
    res.render('auth/login')
})

//Log the user in
router.post('/login', passport.authenticate('local', {
        failureRedirect: '/auth/login',
        successRedirect: '/', // !-> FLASH <-!
        failureFlash: 'Invalid username and/or password.',
        successFlash: 'You are now logged in.'
    })
)

//Log the user out
router.get('/logout', (req, res)=>{
    req.logout() // !-> FLASH <-!
    req.flash('Success! You\'re logged out.')
    res.redirect('/')
})

module.exports = router