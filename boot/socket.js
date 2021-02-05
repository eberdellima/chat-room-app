const { WebSocket } = require('../src/services/socket')
let io = require('socket.io')

const startSocket = (server) => {
  io = io(server)
  new WebSocket().start(io)
}

const getIO = () => {
  return io
}

module.exports = {
  startSocket,
  getIO
}