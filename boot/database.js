const mongoose = require('mongoose')

const config = {
  user: process.env.MMONGO_USER,
  password: process.env.MONGO_PASSWORD,
  database: process.env.MONGO_DATABASE,
  host: process.env.MONGO_HOST,
  port: process.env.MONGO_PORT
}

// IN CASE YOU CONNECT TO REMOTE SERVER DATABASE 
// CHANGE URI TO 
// mongodbL//user:password@host:port/database

const connection = mongoose.connect(`mongodb://localhost:27017/${config.database}`, { useNewUrlParser: true })

const Room = require('../src/models/room')
const Message = require('../src/models/message')

const db = {
  // model: require('model)
  Room: connection.model('Room', Room),
  Message: connection.model('Message', Message),
  connection
}

module.exports = {
  db
}