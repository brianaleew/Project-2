/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const express = require('express')
const Product = require('../models/product')
const WellnessTip = require('../models/wellnessTip')
const Comment = require('../models/comment')


/////////////////////////////////////
//// Create Router               ////
/////////////////////////////////////
const router = express.Router()



//////////////////////////////
//// Routes               ////
//////////////////////////////

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

//Post -> allowing loggedIn users to create comments under WELLNESSTIPS
router.post('/wellnessTips/:wellnessTipId', (req, res) => {
    const wellnessTipId = req.params.wellnessTipId
    console.log('THIS IS THE SESSION:', req.session)
    if(req.session.loggedIn) {
        req.body.owner = req.session.userId
        
        const theComment = req.body
        console.log(`THIS IS THE WELLNESS TIP ${wellnessTipId}`)
        WellnessTip.findById(wellnessTipId)
        .populate('comments.note')
		.populate('comments.owner', 'username')
        .then(wellnessTip => {
            wellnessTip.comments.push(theComment)
            console.log('WellnessTip', wellnessTip)
            return wellnessTip.save()
        })
        .then(wellnessTip => {
            res.redirect(`/wellnessTips/${wellnessTipId}`)
        })
        .catch(err => {
            console.log(err)
            res.redirect(`/error?error=${err}`)
        })

    } else {
        res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20comment%20on%20this%20item`)
    }
})

//Post -> allowing loggedIn users to create comments under PRODUCTS

router.post('/products/:productId', (req, res) => {
    const productId = req.params.productId
    console.log('THIS IS THE SESSION:', req.session)
    if(req.session.loggedIn) {
        req.body.owner = req.session.userId
        
        const theComment = req.body
        console.log(`THIS IS THE PRODUCT ${productId}`)
        Product.findById(productId)
        .populate('comments.note')
		.populate('comments.owner', 'ref')
        .then(product => {
            product.comments.push(theComment)
            console.log('Product', product)
            return product.save()
        })
        .then(product => {
            res.redirect(`/products/${productId}`)
        })
        .catch(err => {
            console.log(err)
            res.redirect(`/error?error=${err}`)
        })

    } else {
        res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20comment%20on%20this%20item`)
    }
})


//Delete 

// DELETE -> `/comments/delete/<WellnessTipId>/<CommentId>`
// make sure only the author of the comment can delete the comment
router.delete('/delete/:wellnessTipId/:commentId', (req, res) => {
    const { wellnessTipId, commentId } = req.params
    
    WellnessTip.findById(wellnessTipId)
        .then(wellnessTip => {
            // get the comment, we'll use the built in subdoc method called .id()
            const theComment = wellnessTip.comments.id(commentId)
            console.log('this is the comment to be deleted: \n', theComment)
            // then we want to make sure the user is loggedIn, and that they are the author of the comment
            if (req.session.loggedIn) {
                // if they are the owner, allow them to delete
                if (theComment.owner == req.session.userId) {
                    // we can use another built in method - remove()
                    theComment.remove()
                    wellnessTip.save()
                    // res.sendStatus(204) //send 204 no content
                    res.redirect(`/collection/feed`)
                } else {
                    // otherwise send a 401 - unauthorized status
                    // res.sendStatus(401)
                    res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20comment`)
                }
            } else {
                // otherwise send a 401 - unauthorized status
                // res.sendStatus(401)
                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20comment`)
            }
        })
        .catch(err => {
            console.log(err)
            // res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})


// DELETE -> `/comments/delete/<productId>/<CommentId>`
// make sure only the author of the comment can delete the comment
router.delete('/delete/:productId/:commentId', (req, res) => {
    const { productId, commentId } = req.params
    
    Product.findById(productId)
        .then(product => {
            // get the comment, we'll use the built in subdoc method called .id()
            const theComment = product.comments.id(commentId)
            console.log('this is the comment to be deleted: \n', theComment)
            // then we want to make sure the user is loggedIn, and that they are the author of the comment
            if (req.session.loggedIn) {
                // if they are the owner, allow them to delete
                if (theComment.owner == req.session.userId) {
                    // we can use another built in method - remove()
                    theComment.remove()
                    product.save()
                    // res.sendStatus(204) //send 204 no content
                    res.redirect(`/collection/feed`)
                } else {
                    // otherwise send a 401 - unauthorized status
                    // res.sendStatus(401)
                    res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20comment`)
                }
            } else {
                // otherwise send a 401 - unauthorized status
                // res.sendStatus(401)
                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20comment`)
            }
        })
        .catch(err => {
            console.log(err)
            // res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})



// Export the Router
module.exports = router