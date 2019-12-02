const RoomRouter = require('../src/routes/room')
const MessageRouter = require('../src/routes/message')

module.exports = (app) => {
  app.use('/messages', MessageRouter)
  app.use('/rooms', RoomRouter)
}