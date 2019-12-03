const { logError } = require('zippy-logger')
const { db } = require('../../boot/database')
const { getIO } = require('../../boot/socket')

class RoomController {
  
  /**
   * Get list of rooms for specific user
   * @params {Number} user_id  Id of user
   * @returns {{ rooms: [Room] }} an object which contrains array of rooms 
   */
  async index(user_id){
    try {

      const userId = user_id
      const limit = 20
      const orderBy = { updated_at: 'desc' }
      const skip = req.params.offset ? req.params.offset : 0

      let rooms = await db.Room.findAll({
        participants: userId
      })
      .skip(skip)
      .limit(limit)
      .sort(orderBy)

      rooms = rooms.filter(room => room != null )

      return { rooms }

    } catch(err) {
      logError({ message: err, path: 'Room controller, index, global catch'})
    }
  }

  /**
   * Create new room by user
   * @params {{ room_name: String, participants: [Number], created_by_user: Number}}  room data dasd
   * @returns {{ room: Room }} object which containes the created/existing room
   */
  async create(data) {
    try {

      const { room_name, participants, created_by_user } = data

      const existingRoom = await db.Room.findOne({
        participants,
        created_by_user,
        room_name
      })

      if(existingRoom) {
        return { room: existingRoom }
      }

      const newRoom = new db.Room({
        room_name, 
        participants,
        created_by_user,
        created_at: new Date()
      })

      const savedRoom = await newRoom.save()
      const roomName = `room_${savedRoom.id}`

      const io = getIO()

      Object.keys(io.sockets.sockets).forEach(socket => {
        if(participants.include(io.sockets.sockets[socket].userId)) {
          io.sockets.sockets[socket].join(roomName)
        }
      })

      return { room: savedRoom }

    } catch(err) {
      logError({ message: err, path: 'Room controller, create, global catch' })
    }
  }

  /**
   * Get room by id
   * @params {{room_id: Number, user_id: Number}} data  data to find room
   * @returns {room: Room} the requested room
   */
  async get(data) {
    try {

      const { room_id, user_id } = data

      const room = await db.Room.findOne({
        id: room_id,
        participants: user_id
      })

      if(!room) {
        return { error: 'Not found!', status: 404 }
      }

      if(room.participants.indexOf(user_id) === -1) {
        return { error: 'Not part of this room!', status: 409 }
      }

      return { room }

    } catch(err) {
      logError({ message: err, path: 'Room controller, get, global catch' })
    }
  }

  /**
   * Remove user from room
   * @params {{room_id: Number, user_id: Number }} data  data to find room
   * @returns {{removed: Boolean}} status of user in room
   */
  async remove(data) {
    try {

      const { room_id, user_id } = data

      let room = await db.Room.findOne({
        id: room_id,
        participants: user_id
      })

      if(!room) {
        return { error: 'Not found!', status: 404 }
      }

      const index = room.participants.indexOf(user_id)
      const updatedParticipants = room.participants.splice(index, 1)
      const updatedRoom = await room.update({participants: updatedParticipants})

      return { room: updatedRoom }

    } catch(err) {
      logError({ message: err, path: 'Room controller, remove, global catch' })
    }
  }

  async join(data) {
    try {
      const { roomId, participant_id, user_id } = data

      const room = await db.Room.findOne({
        id: roomId,
        created_by_user: user_id
      })

      if(!room) {
        return {error: 'Not found!', status: 404 }
      }

      let updatedParticipants = [...room.participants]

      if(updatedParticipants.indexOf(user_id) !== -1) {
        return { room }
      }

      updatedParticipants.push(user_id)
      const updatedRoom = await room.update({ participants: updatedParticipants })

      const roomName = `room_${updatedRoom.id}`
      const io = getIO()
      
      Object.keys(io.sockets.sockets).forEach(socket => {
        if(io.sockets.sockets[socket].userId === user_id) {
          io.sockets.sockets[socket].join(roomName)
        }
      })

      return { room: updatedRoom }

    } catch(err) {
      logError({message: err, path: 'Room controller, join, global catch'})
    }
  }

}

module.exports = RoomController