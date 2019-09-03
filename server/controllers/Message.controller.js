const Logger = require('../../config/logger')
const MessageRepository = new (require('../repositories/Message.repository'))()
const UserRepository = new (require('../repositories/User.repository'))()
const RoomRepository = new (require('../repositories/Room.repository'))()
const CounterRepository = new (require('../repositories/Counter.repository'))()

class MessageController {

    async add (data) {
        try {

            const senderId = data.userId
            const message = data.message
            const roomId = data.roomId

            if (isNaN(senderId)) {
                // res.status(400).send("Invalid user ID!")
                return { error: "Invalid user ID!", code: 400 }
            }

            const user = await UserRepository.getUserById(senderId)

            if (!user) {
                // res.status(404).send("User not found!")
                return { error: "User not found!", code: 404 }
            }

            if (user && user.error) {
                Logger(user.error, 'Message.controller.js / add')
                // res.status(500).send({ error: user.error })
                return { error: user.error, code: 500 }
            }

            const room = await RoomRepository.getRoomById(roomId)

            if (!room) {
                // res.status(404).send("Room not found!")
                return { error: "Room not found!", code: 404 }
            }

            if (room && room.error) {
                Logger(room.error, 'Message.controller.js / add')
                // res.status(500).send({ error: room.error })
                return { error: room.error, code: 500 }
            }

            const isUserInRoom = room.users.filter( roomUser => roomUser === user.username)

            if(isUserInRoom.length === 0) {
                // res.status(404).send("User not in room!")
                return { error: "User not in room!", code: 404 }
            }

            if (!message) {
                // res.status(400).send("Invalid message!")
                return { error: "Invalid message!", code: 400 }
            }

            let messageId = await CounterRepository.getMessageCount()
            messageId = messageId === null ? 1 : messageId

            const addedMessage = await MessageRepository.addMessage(user.id, room.id, messageId)

            if (addedMessage && addedMessage.error) {
                Logger(addedMessage.error, 'Message.controller.js / add')
                // res.status(500).send({ error: addedMessage.error })
                return { error: addedMessage.error, code: 500 }
            }

            messageId += 1

            const newMessageId = await CounterRepository.setMessageCount(messageId)

            if (newMessageId && newMessageId.error) {
                Logger(newMessageId.error, 'Message.controller.js / add')
                // res.status(500).send({ error: newMessageId.error })
                return { error: newMessageId.error, code: 500 }
            }

            // res.status(201).send({ message: addedMessage })
            return { data: { message: addedMessage} }

        } catch (err) {
            Logger(err.message, 'Message.controller.js / add')
            // res.status(500).send(err.message)
            return { error: err.message, code: 500 }
        }
    }


    async remove (data) {
        try {

            const userId = data.userId
            let messageId = data.messageId
            messageId = parseInt(messageId)

            if (isNaN(messageId)) {
                // res.status(400).send("Invalid message ID!")
                return { error: "Invalid message ID!", code: 400}
            }

            const messageExists = await MessageRepository.getMessage(messageId)

            if (!messageExists) {
                // res.status(404).send("Message not found!")
                return { error: "Message not found!", code: 404 }
            }

            if (messageExists && messageExists.error) {
                Logger(messageExists.error, 'Message.controller.js / remove')
                // res.status(500).send({ error: messageExists.error})
                return { error: messageExists.error, code: 500 }
            }

            const roomExists = await RoomRepository.getRoomById(messageExists.room_id)

            if (!roomExists) {
                // res.status(404).send("Room not found!")
                return { error: "Room not found!", code: 404 }
            }

            if (roomExists && roomExists.error) {
                Logger(roomExists.error, 'Message.controller.js / remove')
                // res.status(500).send({ error: roomExists.error})
                return { error: roomExists.error, code: 500 }
            }

            if (isNaN(userId)) {
                // res.status(400).send("Invalid user ID!")
                return { error: "Invalid user ID!", code: 400 }
            }

            const userExists = await UserRepository.getUserById(userId)

            if (!userExists) {
                // res.status(404).send("User not found!")
                return { error: "User not found!", code: 404 }
            }

            if (userExists && userExists.error) {
                Logger(userExists.error, 'Message.controller.js / remove')
                // res.status(500).send({ error: userExists.error})
                return { error: userExists.error, code: 500 }
            }

            if (userExists.username !== messageExists.sender) {
                // res.status(400).send("Invalid user!")
                return { error: "Invalid user!", code: 400 }
            }

            const removedMessage = await MessageRepository.removeMessage(messageExists.id)

            if (removedMessage && removedMessage.error) {
                Logger(removedMessage.error, 'Message.controller.js / remove')
                // res.status(500).send({ error: removedMessage.error })
                return { error: removedMessage.error, code: 500 }
            }

            // res.status(200).send({ removedMessage: removedMessage })
            return { data: { removeMessage: removedMessage} }

        } catch (err) {
            Logger(err.message, 'Message.controller.js / remove')
            // res.status(500).send({ error: err.message })
            return { error: err.message, code: 500 }
        }
    }
}

module.exports = MessageController
