// Import Dependencies
const express = require('express')
const WellnessTip = require('../models/wellnesstip')

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

//TEMP SEED DATA FOR TESTING 
// router.get('/seed', (req, res) => {
//     // array of starter tips
//     const starterWellnessTips = [
//         {title: 'Raspberry Tea', description: 'this tea has helped me significantly decrease my period cramps', goodFor: ['menstrual cramps'], source: 'google.com', tipImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdf1pBO_CJxKetBMhmPRMjCSWFrQGNQqNQhw&usqp=CAU' },
//         {title: 'Malasana (Garland Pose)', description: 'This pose stretches the lower body making it great for lower back pain!', source: 'https://www.yogajournal.com/poses/yoga-by-benefit/back-pain/yoga-lower-back-pain/', tipImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTlAWYbVOR8zZb11KqtxmdhVcUxMk9QeXacQ&usqp=CAU'},
// 		{title: 'Vitamin B12', description: 'after taking these for the past month, I can truly say that I have increased energy and go longer without needing my coffee and blah blah blah.', goodFor: ['energy'], source: 'google.com', tipImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT30pdF1X847MP6eyvDZ2wH5UhNIc0AFaConCFFh9BvhvHY4_O9kOz1SjaPrgCwtAZ3aeo&usqp=CAU' },
// 		{title: 'Magnesium Glycinate', description: 'being deficient in magnesium sucks but with these supplements i have had better sleep and have healthier poops and stuff dude', goodFor: ['better sleep', ' constipation', ' overall mood boost'], source: 'google.com', tipImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLRPyIt-W8zUk5pjjz-GGwTgyti2BuJWshig&usqp=CAU' },
// 		{title: 'Humidifiers are great!', description: 'The air in Arizona is soo dry so investing in a humidifier is great blah blah blah benefits benefits', goodFor: ['good stuff', ' other good stuff', 'you get it'], tipImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrZa_yzATtPSo6gyz8Nz-npcDlU7RPR6BKdA&usqp=CAU' },
//     ]
//     WellnessTip.deleteMany({})
//         .then(() => {
//             // then we'll seed(create) our starter fruits
//             WellnessTip.create(starterWellnessTips)
//                 // tell our db what to do with success and failures
//                 .then(data => {
//                     res.json(data)
//                 })
//                 .catch(err => console.log('The following error occurred: \n', err))
//         })
// })

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
			res.redirect(`/collection/mine`)
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
		.populate('comments.note')
		.populate('comments.owner', 'username')
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
	WellnessTip.findById(wellnessTipId)
		.then(wellnessTip => {
			if (wellnessTip.owner == req.session.userId) {
                // send success message
                // res.sendStatus(204)
                // delete the fruit
                return wellnessTip.deleteOne()
            } else {
                // otherwise send a 401 unauthorized status
                // res.sendStatus(401)
                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20wellnessTip`)
            }
        })
        .then(() => {
            res.redirect(`/collection/mine`)
        })
        .catch(err => {
            console.log(err)
            // res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})


// Export the Router
module.exports = router