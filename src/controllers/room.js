const { logError } = require('zippy-logger')
const { db } = require('../../boot/database')

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
      const orderBy = { updated_at: 'asc' }

      let rooms = await db.Room.findAll({
        participants: userId
      })
      .limit(limit)
      .sort(orderBy)

      //  Join socket to threads

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

      // Join socket to thread

      const newRoom = new db.Room({
        room_name, 
        participants,
        created_by_user,
        created_at: new Date()
      })

      return { room: newRoom }

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

      // Join socket to thread

      if(!room) {
        return { error: 'Not found!', status: 404 }
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

      // Join socket to thread

      if(!room) {
        return { error: 'Not found!', status: 404 }
      }

      const index = room.participants.indexOf(user_id)
      room.participants = room.participants.splice(index, 1)
      await room.update({participatns: room.participants})

      return {removed: true}

    } catch(err) {
      logError({ message: err, path: 'Room controller, remove, global catch' })
    }
  }

}

module.exports = RoomController