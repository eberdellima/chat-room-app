const { db } = require('../../boot/database')


class WebSocket {
  async start(io) {
    io.sockets.on('connection', async socket => {
      
      socket.emmit('connected', JSON.stringify({ status: 'online' }))

      socket.on('register_socket', async data => {
        
        const parsedData = JSON.parse(data)
        const { userId } = parsedData.userId

        const rooms = await db.Room.find({
          participants: userId
        })

        rooms.forEach(room => {
          socket.userId = userId
          const roomName = `room_${room.id}` 
          socket.room = roomName
          socket.join(roomName)
        });

      })

      socket.on('disconnect', () => {
        socket.emmit('dissconnected', JSON.stringify({ start: 'offline' }))
      })

    })
  }
}

module.exports = {
  WebSocket
}