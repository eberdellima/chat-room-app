const Message = require('../models/Message.model')

class MessageRepository {

    constructor(odm) {
        if (MessageRepository.exists) {
            return MessageRepository.instance
        }
        this.Message = Message(odm)
        MessageRepository.exists = true
        MessageRepository.instance = this
    }


    async getMessage(id) {
        try {

            const message = await this.Message.find({ id })
            return message

        } catch (err) {
            return { logInfo: {
                level: "Error",
                message: err.message,
                timestamp: Date.now()
            }}
        }
    }

    
    async getMessagesByRoom(roomId, page) {
        try{
            const messagesPerPage = 12

            const messages = await this.Message.find({
                room_id: roomId
            }).skip( (page -1) * messagesPerPage)
            .limit(messagesPerPage)
            .sort({ id: "desc" })

            return messages

        } catch (err) {
            return { logInfo: {
                level: "Error",
                message: err.message,
                timestamp: Date.now()
            }}
        }
    }


    async addMessage(sender, roomId) {
        try {

            const newMessage = new this.Message({
                sender,
                room_id: roomId,
                sent_date: Date.now()
            })
            const savedMessage = await newMessage.save()
            return savedMessage

        } catch (err) {
            return { logInfo: {
                level: "Error",
                message: err.message,
                timestamp: Date.now()
            }}
        }
    }


    async removeMessage(id) {
        try {

            const removedMessage = await this.Message.findOneAndDelete({ id: id })
            return removedMessage

        } catch (err) {
            return { logInfo: {
                level: "Error",
                message: err.message,
                timestamp: Date.now()
            }}
        }
    }


    async messageIsOwnedByUser(messageId, user) {
        try {

            const exists = await this.Message.find({
                id: messageId,
                sender: user
            })

            return exists

        } catch (err) {
            return { logInfo: {
                level: "Error",
                message: err.message,
                timestamp: Date.now()
            }}
        }
    }


    async patchMessage(messageId, data) {
        try {

            const query = { id: messageId }
            
            const patchedMessage = await this.Message.findOneAndUpdate(query, data)
            return patchedMessage

        } catch (err) {
            return { logInfo: {
                level: "Error",
                message: err.message,
                timestamp: Date.now()
            }}
        }
    }


    async removeRoomMessages(roomId) {
        try {

            const deletedMessages = await this.Message.deleteMany({ room_id: roomId })
            return deletedMessages

        } catch (err) {
            return { logInfo: {
                level: "Error",
                message: err.message,
                timestamp: Date.now()
            }}
        }
    }


}

module.exports = MessageRepository
