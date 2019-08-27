const Logger = require('../../config/logger')
const MessageRepository = new (require('../repositories/Message.repository'))()
const UserRepository = new (require('../repositories/User.repository'))()
const RoomRepository = new (require('../repositories/Room.repository'))()
const CounterRepository = new (require('../repositories/Counter.repository'))()

class MessageController {

    async add (req, res) {
        try {

            const senderId = req.body.userId
            const message = req.body.message
            const roomId = req.body.roomId

            if (isNaN(senderId)) {
                res.status(400).send("Invalid user ID!")
            }

            const user = await UserRepository.getUserById(senderId)

            if (!user) {
                res.status(404).send("User not found!")
            }

            if (user && user.error) {
                Logger(user.error, req.path)
                res.status(500).send({ error: user.error })
            }

            const room = await RoomRepository.getRoomById(roomId)

            if (!room) {
                res.status(404).send("Room not found!")
            }

            if (room && room.error) {
                Logger(room.error, req.path)
                res.status(500).send({ error: room.error })
            }

            const isUserInRoom = room.users.filter( roomUser => roomUser === user.username)

            if(isUserInRoom.length === 0) {
                res.status(404).send("User not in room!")
            }

            if (!message) {
                res.status(400).send("Invalid message!")
            }

            let messageId = await CounterRepository.getMessageCount()
            messageId = messageId === null ? 1 : messageId

            const addedMessage = await MessageRepository.addMessage(user.id, room.id, messageId)

            if (addedMessage && addedMessage.error) {
                Logger(addedMessage.error, req.path)
                res.status(500).send({ error: addedMessage.error })
            }

            messageId += 1

            const newMessageId = await CounterRepository.setMessageCount(messageId)

            if (newMessageId && newMessageId.error) {
                Logger(newMessageId.error, req.path)
                res.status(500).send({ error: newMessageId.error })
            }

            res.status(201).send({ message: addedMessage })

        } catch (err) {
            Logger(err.message, req.path)
            res.status(500).send(err.message)
        }
    }


    async remove (req, res) {
        try {

            const { messageId, userId } = req.body

            if (isNaN(messageId)) {
                res.status(400).send("Invalid message ID!")
            }

            const messageExists = await MessageRepository.getMessage(messageId)

            if (!messageExists) {
                res.status(404).send("Message not found!")
            }

            if (messageExists && messageExists.error) {
                Logger(messageExists.error, req.path)
                res.status(500).send({ error: messageExists.error})
            }

            const roomExists = await RoomRepository.getRoomById(messageExists.room_id)

            if (!roomExists) {
                res.status(404).send("Room not found!")
            }

            if (roomExists && roomExists.error) {
                Logger(roomExists.error, req.path)
                res.status(500).send({ error: roomExists.error})
            }

            if (isNaN(userId)) {
                res.status(400).send("Invalid user ID!")
            }

            const userExists = await UserRepository.getUserById(userId)

            if (!userExists) {
                res.status(404).send("User not found!")
            }

            if (userExists && userExists.error) {
                Logger(userExists.error, req.path)
                res.status(500).send({ error: userExists.error})
            }

            if (userExists.username !== messageExists.sender) {
                res.status(400).send("Invalid user!")
            }

            const removedMessage = await MessageRepository.removeMessage(messageExists.id)

            if (removedMessage && removedMessage.error) {
                Logger(removedMessage.error, req.path)
                res.status(500).send({ error: removedMessage.error })
            }

            res.status(200).send({ removedMessage: removedMessage })

        } catch (err) {
            Logger(err.message, req.path)
            res.status(500).send({ error: err.message })
        }
    }
}

module.exports = MessageController
