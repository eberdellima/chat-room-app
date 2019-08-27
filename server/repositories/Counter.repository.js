const Counter = require('../models/Counter.model')

class CounterRepository {

    constructor(odm) {
        if(CounterRepository.exists) {
            return CounterRepository.instance
        }
        this.Counter = Counter(odm)
        CounterRepository.exists = true
        CounterRepository.instance = this
    }


    async getUserCount () {
        try {

            const userCount = await this.Counter.find({}).select({ user_counter })
            return userCount

        } catch (err) {
            return {error: err.message}
        }
    }


    async setUserCount (userCount) {
        try {

            const userCount = await this.Counter.findOneAndUpdate( {}, {user_counter: userCount} )

        } catch (err) {
            return {error: err.message}
        }
    }


    async getMessageCount () {
        try {

            const messageCount = await this.Counter.find({}).select({ message_counter })
            return messageCount

        } catch (err) {
            return {error: err.message}
        }
    }


    async setMessageCount (messageCount) {
        try {

            const newMessageCount = await this.Counter.findOneAndUpdate( {}, {message_counter: messageCount} )
            return newMessageCount

        } catch (err) {
            return {error: err.message}
        }
    }

    
    async getRoomCount () {
        try {

            const roomCount = await this.Counter.find({}).select({ room_counter })
            return roomCount

        } catch (err) {
            return {error: err.message}
        }
    }


    async setRoomCount (roomId) {
        try {

            const newRoomCount = await this.Counter.findOneAndUpdate( {}, {room_counter: roomId} )
            return roomCount

        } catch (err) {
            return {error: err.message}
        }
    }

}

module.exports = CounterRepository
