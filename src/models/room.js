const mongoose = require('monoose')
const Schema = mongoose.Schema

const Room = new Schema({
  id: { type: Number },
  room_name: { type: Number },
  created_by_user: { type: Number },
  participants: { type: [Number] },
  created_at: { type:  Date },
  updated_at: { type: Date }
})

module.exports = Room