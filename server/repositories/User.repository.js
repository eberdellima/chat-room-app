const User = require('../models/User.model')

class UserRepository {

    constructor(odm) {
        if(!UserRepository.exists) {
            return UserRepository.instance
        }
        this.User = User(odm)
        UserRepository.exists = true
        UserRepository.instance = this
    }

    async createUser(username, password, icon, id) {
        try {

            const newUser = new this.User({
                id,
                username,
                password,
                icon
            })
            const savedUser = await newUser.save()
            return savedUser

        } catch (err) {
            return { logInfo: {
                level: "Error",
                message: err.message,
                timestamp: Date.now()
            }}
        }
    }


    async updateUserData(userId, data) {
        try {
            const query = { id: userId }

            const patchedUser = await this.User.findOneAndUpdate(query, data)
            return patchedUser
        } catch (err) {
            return { logInfo: {
                level: "Error",
                message: err.message,
                timestamp: Date.now()
            }}
        }
    } 


    async getUserById(id) {
        try {

            const user = await this.User.find({ id })
            return user

        } catch (err) {
            return { logInfo: {
                level: "Error",
                message: err.message,
                timestamp: Date.now()
            }}
        }
    }


    async listUser(userIds) {
        try {

            const users = await this.User.find({ id: { $in: [...userIds] } })
            return users

        } catch (err) {
            return { logInfo: {
                level: "Error",
                message: err.message,
                timestamp: Date.now()
            }}
        }
    }


    async updateUserRooms(userId, rooms) {
        try {

            const query = { id: userId }
            const userPatch = { rooms }

            const patchedUser = await this.User.findOneAndUpdate(query, userPatch)
            return patchedUser

        } catch (err) {
            return { logInfo: {
                level: "Error",
                message: err.message,
                timestamp: Date.now()
            }}
        }
    }


     /**
     * TODO
     * Implement method for bulk update of rooms
     */

     
     async removeUser(userId) {
         try {

            const removedUser = await this.User.findOneAndDelete({ id: userId })
            return removedUser

         } catch (err) {
            return { logInfo: {
                level: "Error",
                message: err.message,
                timestamp: Date.now()
            }}
         }
     }
}

module.exports = UserRepository
