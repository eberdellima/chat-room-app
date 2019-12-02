const db = require('../../boot/database')


class WebSocket {
  async start(io) {
    io.sockets.on('connection', async socket => {
      
      socket.emmit('connected', JSON.stringify({ status: 'online' }))

      socket.on('disconnect', () => {
        socket.emmit('dissconnected', JSON.stringify({ start: 'offline' }))
      })

    })
  }
}

module.exports = {
  WebSocket
}