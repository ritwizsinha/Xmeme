const mongoose = require('mongoose');
const { Schema } = mongoose;
const post = new Schema({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        required: false,
        default: 0,
    },
    posted: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

module.exports = mongoose.model('Post', post);