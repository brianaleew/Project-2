/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const express = require('express')
const Product = require('../models/product')

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

//TEMPORARY SEED ROUTE

router.get('/seed', (req, res) => {
    // array of starter resources(fruits)
    const starterProducts = [
        {name: 'Hyaloronic Acid Airy Sun Stick', brand: 'Isntree' , goodFor: ['UV Sun protection'], skinType: 'All', description: 'One of my favorite korean sunscreens. The stick makes it easy to reapply on the go!' , personalRating: 9.5, productImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDou99rW67JVTq2kCAsHj7RqEjR-xnfJNDVA&usqp=CAU', productLink: 'https://oo35mm.com/products/isntree-hyaluronic-acid-airy-sun-stick?_pos=1&_sid=8b052bf54&_ss=r'  },
        {name: 'Glow Serum', brand: 'Beauty of Joseon' , goodFor: ['skin-brightening', ' anti-inflammation'], skinType: 'All', description: 'Makes my skin feel amazing and improved my overall complexion. Propolis extract makes for a great natural option' , personalRating: 8, productImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAnza2GJO_hj4c7CyYCtygmTeSw7Ig6HKm6Q&usqp=CAU', productLink: 'https://oo35mm.com/products/beauty-of-joseon-glow-serum?_pos=1&_sid=d63ddd8bd&_ss=r' },
        {name: 'Cicaful Ampoule', brand: 'Beplain' , goodFor: ['strengthening the skin barrier', 'calming the skin'], skinType: 'All', description: 'One of my favorite korean sunscreens. The stick makes it easy to reapply on the go!' , personalRating: 7, productImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQrJXypz3paWxcQaTHkoY375ACKVEFJsmOlheRspvMRhP78Ne4jzYkXmPAAq0c4tWu8o0&usqp=CAU', productLink: 'https://oo35mm.com/products/beplain-cicaful-ampoule-i?_pos=1&_sid=7fe1c8722&_ss=r' },
        {name: 'Tea Tree Healing Essential Mask', brand: 'Mediheal' , goodFor: ['oil control', 'calming the skin'], skinType: 'oily, combination', description: 'This mask is the perfect pick-me-up for my skin when its feeling unruly.' , personalRating: 8.5, productImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVPUI1PGN5ILgFFW9hnWaCCAeP8PfQvyFaug&usqp=CAU', productLink: 'https://oo35mm.com/products/mediheal-tea-tree-healing-solution-essential-mask?_pos=1&_sid=9635f7b53&_ss=r' },
    ]
    // then we delete every fruit in the database(all instances of this resource)
    Product.deleteMany({})
        .then(() => {
            // then we'll seed(create) our starter fruits
            Product.create(starterProducts)
                // tell our db what to do with success and failures
                .then(data => {
                    res.json(data)
                })
                .catch(err => console.log('The following error occurred: \n', err))
        })
})



// index ALL
router.get('/', (req, res) => {
	Product.find({})
		.then(products => {
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			
			res.render('products/index', { products, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// index that shows only the user's products
router.get('/mine', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	Product.find({ owner: userId })
		.then(products => {
			res.render('products/index', { products, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// new route -> GET route that renders our page with the form
router.get('/new', (req, res) => {
	const { username, userId, loggedIn } = req.session
	res.render('products/new', { username, loggedIn })
})

// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
	

	req.body.owner = req.session.userId
	Product.create(req.body)
		.then(product => {
			console.log('this was returned from create', product)
			res.redirect('/collection/mine')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	// we need to get the id
	const productId = req.params.id
	Product.findById(productId)
		.then(product => {
			res.render('products/edit', { product, ...req.session })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// // update route
// router.put('/:id', (req, res) => {
// 	const id = req.params.id
// 	Product.findById(id)
// 		.then(product => {
// 			console.log('THIS IS THE OWNER:', product.owner)
// 			if (product.owner.username == req.session.userId) {
// 				return product.updateOne(req.body)
// 			} else {
// 				res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20edit%20this%20item`)
// 			}
// 			res.redirect(`/products/${id}`)
// 		}) 
// 		.then(() => {
// 			res.redirect(`/collection/mine`)
// 		})
// 		.catch((error) => {
// 			res.redirect(`/error?error=${error}`)
// 		})
// })
// NEW UPDATE ROUTE
router.put('/:id', (req, res) => {
	const productId = req.params.id

	Product.findByIdAndUpdate(productId, req.body, { new: true })
		.then(product => {
			res.redirect(`/collection/mine`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// show route
router.get('/:id', (req, res) => {
	const productId = req.params.id
	Product.findById(productId)
		.populate('comments.note')
		.populate('comments.owner', 'username')
		.then(product => {
            const {username, loggedIn, userId} = req.session
			res.render('products/show', { product, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// delete route
router.delete('/:id', (req, res) => {
	const productId = req.params.id
	Product.findByIdAndRemove(productId)
		.then(product => {
			res.redirect('/collection/mine')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})




// Export the Router
module.exports = router