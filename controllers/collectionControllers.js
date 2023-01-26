/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const express = require('express')
const Product = require('../models/product')
const WellnessTip = require('../models/wellnessTip')


/////////////////////////////////////
//// Create Router               ////
/////////////////////////////////////
const router = express.Router()



//////////////////////////////
//// Routes               ////
//////////////////////////////

//index ALL -> A collection of ALL products and wellnessTips from ALL USERS (including seeds)
// placed above middleware to make it accessible to all users,not just those with an account
router.get('/feed', (req, res) => {
	// let allProducts
	const { username, loggedIn } = req.session 
	Product.find({})
		.then( products => {
			// allProducts = products
			// console.log('This is ALL PRODUCTS:', allProducts)
			WellnessTip.find({})
				.then( wellnessTips => {
					// let allTips = wellnessTips
					// console.log('THESE ARE THE TIPS', allTips)
					res.render('collection/feed', { products, wellnessTips, username, loggedIn })

				})
				.catch(error => res.redirect(`/error?error=${error}`))
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
	})
})

// Router Middleware
// Authorization middleware 
router.use((req, res, next) => {
	// checking the loggedIn boolean of our session
	if (req.session.loggedIn) {
		// if they're logged in, go to the next thing(thats the controller)
		next()
	} else {
		// if they're not logged in, send them to the login page
		res.redirect('/auth/login')
	}
})

// Routes

//index ALL -> A collection of ALL products and wellnessTips for 
// LOGGED IN USER ONLY!
router.get('/mine', (req, res) => {
	let userProducts
	const { username, userId, loggedIn } = req.session 
	Product.find({ owner: userId })
		.then( products => {
			
			
			WellnessTip.find({ owner: userId })
				.then( wellnessTips => {
					res.render('collection/mine', { products, wellnessTips, username, loggedIn })

				})
				.catch(error => res.redirect(`/error?error=${error}`))
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
	})
})





// Export the Router
module.exports = router