////////////////////////////////
// Import Dependencies    /////
///////////////////////////////

const commentSchema = require('./comment')
const mongoose = require('./connection')

const { Schema, model } = mongoose

//////////////////////////////////
/// Defining Model         //////
////////////////////////////////

const wellnessTipSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: { 
        type: String,
        required: true
    },
    goodFor: Array,
    source: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [commentSchema]
}, { timestamps: true }
)

//creating the actual model
const WellnessTip = model('WellnessTip', wellnessTipSchema)


//////////////////////////////////
/// Exporting Model        //////
////////////////////////////////

module.exports = WellnessTip  


//