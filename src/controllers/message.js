const { logError } = require('zippy-logger')
const { db } = require('../../boot/database')

class MessageController {
  
  /**
   * Get list of messages for room
   * @params {{room_id: Number, user_id: Number}} data  info for finding room
   * @returns {{room: Room, messages: [Message]}}
   */
  async index(data) {
    try {

      const { room_id, user_id } = data

      const roomExists = await db.Room.findOne({
        id: room_id,
        participants: user_id
      })

      if(!roomExists) {
        return { error: 'Not Found!', status: 404 }
      }

      // Join socket to thread

      const limit = 20
      const orderBy = { updated_at: 'asc'}

      const messages = await db.Message.findAll({
        thread_id: roomExists.id
      })
      .limit(limit)
      .sort(orderBy)

      return { room: roomExists, messages }

    } catch(err) {
      logError({ message: err, path: 'Message controllre, index, global catch' })
    }
  }

  /**
   * Add new message to room
   * @params {{room_id: Number, user_id: Number, body: String}} data info for new message
   * @returns {{room: Room, message: Message}}
   */
  async create(data) {
    try {

      const { room_id, user_id, body } = data

      const roomExists = await db.Room.findOne({
        id: room_id,
        participants: user_id
      })

      if(!roomExists) {
        return { error: 'Not Found!', status: 404 }
      }

      // Join socket to thread

      const newMessage = new db.Message({
        thread_id: roomExists.id,
        sender_id: user_id,
        created_at: new Date(),
        updated_at: new Date(),
        body
      })

      await newMessage.save()

      return { room: roomExists, message: newMessage }      

    } catch(err) {
      logError({ message: err, path: 'Message controller, create, global catch' })
    }
  }

}

module.exports = MessageController