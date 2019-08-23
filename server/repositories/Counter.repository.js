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
            return { logInfo: {
                level: "Error",
                message: err.message,
                timestamp: Date.now()
            }}
        }
    }


    async getMessageCount () {
        try {

            const messageCount = await this.Counter.find({}).select({ message_counter })
            return messageCount

        } catch (err) {
            return { logInfo: {
                level: "Error",
                message: err.message,
                timestamp: Date.now()
            }}
        }
    }

    
    async getRoomCount () {
        try {

            const roomCount = await this.Counter.find({}).select({ room_counter })
            return roomCount

        } catch (err) {
            return { logInfo: {
                level: "Error",
                message: err.message,
                timestamp: Date.now()
            }}
        }
    }

}

module.exports = CounterRepository
