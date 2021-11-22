require('dotenv').config()
const express = require('express')
const app = express()
const ejsLayouts = require('express-ejs-layouts')
const session = require('express-session')
const passport = require('./config/ppConfig')
const flash = require('connect-flash')
const isLoggedIn = require('./middleware/isLoggedIn')
let db = require('./models')
const methodOverride = require('method-override')
// let moment = require('moment') didn't get to work yet

//added to try to alter table

// views (ejs and layouts) set up
app.set('view engine', 'ejs')
app.use(ejsLayouts)
// method override allows you to override methods with a query parameter
app.use(methodOverride('_method'))

// body parser middelware
app.use(express.urlencoded({extended:false}))

// session middleware
app.use(session({
    secret: process.env.SUPER_SECRET_SECRET,
    resave: false,
    saveUninitialized: true
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// flash middleware (must go AFTER session middleware)
app.use(flash())

// custom middleware
app.use((req, res, next) => {
    // before every route, attach the flash messages and current user to res.locals
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next()
})

// controllers middleware 
app.use('/auth', require('./controllers/auth'))
app.use('/toolRequest', require('./controllers/toolRequest'))
//In another life I'm sure I'm more organized. But not this life.
// app.use('/toolsDisplay', require('./controllers/toolsDisplay'))

// home route
app.get('/', (req, res)=>{
    db.toolRequest.findAll({
        include: [db.user]
    })
    .then((toolRequests) => {
        res.render('home', {toolRequests})
    })
})

// profile route
app.get('/profile', isLoggedIn, (req, res)=>{
    //Find all the users 
    db.user.findAll()
    .then((users) => {
        //Find all the tool requests made by the user
        db.toolRequest.findAll({
            where: {userId: req.user.id},
            include: [db.user]
        })
        .then((myToolRequests) => {
            //Find all the responses made by the user to tool requests made by other users
            // console.log('This is myToolRequests[0]:\n',myToolRequests[0])
            db.response.findAll({
                where: {userId: req.user.id},
                include: [db.toolRequest]
            })
            .then((myResponses) => {
                //Find all responses made by other users to my tool requests
                db.response.findAll({
                    //Yes, there should be a where here. But couldn't figure it out because couldn't include user in toolRequest which is included in response. Almost any TA could elaborate further...
                    include: [db.toolRequest]
                })
                .then(theirResponses => {
                    res.render('profile', {users, myToolRequests, myResponses, theirResponses})
                })
            })
        })
    })
})


app.listen(3000, ()=>{
    console.log("auth_practice running on port 3000")
})