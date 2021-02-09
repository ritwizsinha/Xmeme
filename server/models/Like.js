const mongoose = require('mongoose');
const { Schema } = mongoose;
const like = new Schema({
    ip: {
        type: String,
        required: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
})

module.exports = mongoose.model('Like', like);