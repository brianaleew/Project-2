////////////////////
//  Dependencies  //
////////////////////
require("dotenv").config() // make env variables available
const express = require("express")
const middleware = require('./utils/middleware')



const UserRouter = require('./controllers/user')
const ProductRouter = require('./controllers/productControllers')
const WellnessTipRouter = require('./controllers/wellnessTipControllers')
const CollectionRouter = require('./controllers/collectionControllers')
const CommentRouter = require('./controllers/commentControllers')


// SEE MORE DEPENDENCIES IN ./utils/middleware.js
// user and resource routes linked in ./utils/middleware.js

//////////////////////////////
// Import Models		    //
//////////////////////////////
const User = require("./models/user")
const Product = require('./models/product')
const WellnessTip = require('./models/wellnessTip')
const Comment = require('./models/comment')

//////////////////////////////
// Middleware + App Object  //
//////////////////////////////
const app = require("liquid-express-views")(express())

middleware(app)







app.use('/auth', UserRouter)
app.use('/products', ProductRouter)
app.use('/wellnessTips', WellnessTipRouter)
app.use('/collection', CollectionRouter)
app.use('/comments', CommentRouter)



////////////////////
//    Routes      //
////////////////////

//Home page Route
app.get('/', (req, res) => {
	const { username, userId, loggedIn } = req.session
	res.render('index.liquid', { loggedIn, username, userId })
})
//Error page Route
app.get('/error', (req, res) => {
	const error = req.query.error || 'This Page Does Not Exist'
	const { username, loggedIn, userId } = req.session
	res.render('error.liquid', { error, username, loggedIn, userId })
})

// if page is not found, send to error page
app.all('*', (req, res) => {
	res.redirect('/error')
})



//////////////////////////////
//      App Listener        //
//////////////////////////////
app.listen(process.env.PORT, () => {
	console.log(`listening on port ${process.env.PORT}`)
})