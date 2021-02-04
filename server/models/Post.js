const mongoose = require('mongoose');
const { Schema } = mongoose;
const post = new Schema({
    user: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        required: true,
    },
    posted: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

module.exports = mongoose.model('Post', post);