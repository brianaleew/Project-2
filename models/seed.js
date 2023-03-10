//////////////////////////////////
/// Import Dependencies   //////
////////////////////////////////
const express = require('express')
const mongoose = require('mongoose')
const Product = require('./product')
const WellnessTip = require('./wellnesstip')

//////////////////////////////////
/// Seed Code             //////
////////////////////////////////
//seed was moved to this file for safety purposes, now only we can run this script
// not any ordinary user (risks deleting everything)
// we add "seed": "node /models/seed.js" into our package.json scripts
//and can now run : `npm run seed` to run this 

//this is a new version of our original seed data that used to live with our routes



//SEED route: making starter data (also doubles as reset)
//saving connection in variable
const db = mongoose.connection 
console.log('db in seed', db)
db.on('open', () => {
    //starter array 
    const starterProducts = [
        {name: 'Hyaloronic Acid Airy Sun Stick', brand: 'Isntree' , goodFor: ['UV Sun protection'], skinType: 'All', description: 'One of my favorite korean sunscreens. The stick makes it easy to reapply on the go!' , personalRating: 9.5 },
        {name: 'Glow Serum', brand: 'Beauty of Joseon' , goodFor: ['skin-brightening', 'anti-inflammation'], skinType: 'All', description: 'Makes my skin feel amazing and improved my overall complexion. Propolis extract makes for a great natural option' , personalRating: 8 },
        {name: 'Cicaful Ampoule', brand: 'Beplain' , goodFor: ['strengthening the skin barrier', 'calming the skin'], skinType: 'All', description: 'One of my favorite korean sunscreens. The stick makes it easy to reapply on the go!' , personalRating: 7 },
        {name: 'Tea Tree Healing Essential Mask', brand: 'Mediheal' , goodFor: ['oil control', 'calming the skin'], skinType: 'oily, combination', description: 'This mask is the perfect pick-me-up for my skin when its feeling unruly.' , personalRating: 8.5 },
    ]

   
    //delete every character in database
    Product.deleteMany({})
    .then(() => {
        // then we'll seed(create) our starter characters
        Product.create(starterProducts)
            // tell our app what to do with success and failures
            .then(data => {
                console.log('here are the created products: \n', data)
                // once it's done, we close the connection
                db.close()
            })
            .catch(err => {
                console.log('The following error occurred: \n', err)
                // always close the connection
                db.close()
            })
    })
    .catch(err => {
        console.log(err)
        // always make sure to close the connection
        db.close()
    })
  

})






