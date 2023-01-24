////////////////////////////////
// Import Dependencies    /////
///////////////////////////////

const mongoose = require('./connection')


const { Schema } = mongoose 

////////////////////////////////
// Comment Schema          /////
///////////////////////////////

const commentSchema = new Schema({
    note: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},     
    {
        timestamps: true
    
})


////////////////////////////////
// Export Comment Schema  /////
///////////////////////////////

module.exports = commentSchema