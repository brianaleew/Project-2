// Import Dependencies
const express = require('express')
const WellnessTip = require('../models/wellnessTip')

// Create router
const router = express.Router()

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

// index ALL
router.get('/', (req, res) => {
	WellnessTip.find({})
		.then(wellnessTips => {
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			
			res.render('wellnessTips/index', { wellnessTips, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// index that shows only the user's wellnessTips
router.get('/mine', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	WellnessTip.find({ owner: userId })
		.then(wellnessTips => {
			res.render('wellnessTips/index', { wellnessTips, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// new route -> GET route that renders our page with the form
router.get('/new', (req, res) => {
	const { username, userId, loggedIn } = req.session
	res.render('wellnessTips/new', { username, loggedIn })
})

// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
	

	req.body.owner = req.session.userId
	WellnessTip.create(req.body)
		.then(wellnessTip => {
			console.log('this was returned from create', wellnessTip)
			res.redirect('/wellnessTips')
		})
		// .catch(error => {
		// 	res.redirect(`/error?error=${error}`)
		// })
        .catch(err => console.log(err))
})

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	// we need to get the id
	const wellnessTipId = req.params.id
	WellnessTip.findById(wellnessTipId)
		.then(wellnessTip => {
			res.render('wellnessTips/edit', { wellnessTip })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// update route
router.put('/:id', (req, res) => {
	const wellnessTipId = req.params.id
	req.body.ready = req.body.ready === 'on' ? true : false

	WellnessTip.findByIdAndUpdate(wellnessTipId, req.body, { new: true })
		.then(wellnessTip => {
			res.redirect(`/wellnessTips/${wellnessTip.id}`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// show route
router.get('/:id', (req, res) => {
	const wellnessTipId = req.params.id
	WellnessTip.findById(wellnessTipId)
		.then(wellnessTip => {
            const {username, loggedIn, userId} = req.session
			res.render('wellnessTips/show', { wellnessTip, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// delete route
router.delete('/:id', (req, res) => {
	const wellnessTipId = req.params.id
	WellnessTip.findByIdAndRemove(wellnessTipId)
		.then(wellnessTip => {
			res.redirect('/wellnessTips')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router