const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Message = new Schema({
    sender: {
        type: String,
        required: true
    },

    sent_time: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('messages', Message)