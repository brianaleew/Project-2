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

// Router Middleware
// Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status, this middleware can be moved, commented out, or deleted. 
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

// index ALL -> A collection of ALL products and wellnessTips from ALL USERS (including seeds)

// router.get('/feed', (req, res) => {
// 	Product.find({})
// 		.then(products => {
// 			const username = req.session.username
// 			const loggedIn = req.session.loggedIn
			
// 			res.render('products/index', { products, username, loggedIn })
// 		})
// 		.catch(error => {
// 			res.redirect(`/error?error=${error}`)
// 		})
// })

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


//index ALL -> A collection of ALL products and wellnessTips for 
// LOGGED IN USER ONLY!
router.get('/mine', (req, res) => {
	let userProducts
	const { username, userId, loggedIn } = req.session 
	Product.find({ owner: userId })
		.then( products => {
			userProducts = products
			console.log('This is USER PRODUCTS:', userProducts)
			WellnessTip.find({ owner: userId })
				.then( wellnessTips => {
					res.render('wellnessTips/index', { userProducts, wellnessTips, username, loggedIn })

				})
				.catch(error => res.redirect(`/error?error=${error}`))
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
	})
})





// Export the Router
module.exports = router