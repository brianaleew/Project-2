////////////////////////////////
// Import Dependencies    /////
///////////////////////////////

const commentSchema = require('./comment')
const mongoose = require('./connection')

const { Schema, model } = mongoose

//////////////////////////////////
/// Defining Model         //////
////////////////////////////////

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    brand: { 
        type: String,
        required: true
    },
    goodFor: Array,
    skinType: String,
    personalRating: {
        type:Number,
        required: true
    },
    description: {
        type:String,
        required: true
    }, 
    timeUsed: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [commentSchema]
}, { timestamps: true }
)

//creating the actual model
const Product = model('Product', productSchema)


//////////////////////////////////
/// Exporting Model        //////
////////////////////////////////

module.exports = Product 
