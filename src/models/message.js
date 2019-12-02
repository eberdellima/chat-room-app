const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Message = new Schema({
  id: { type: Number },
  thread_id: { type: Number },
  sender_id: { type: Number },
  created_at: { type: Date },
  updated_at: { type: Date },
  body: { type: String }
})

module.exports = Message