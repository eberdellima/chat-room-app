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

    async createUser({username, password, icon, id}) {
        try {

            const newUser = new this.User({
                id,
                username,
                password,
                icon,
                rooms: []
            })
            const savedUser = await newUser.save()
            return savedUser

        } catch (err) {
            return {error: err.message}
        }
    }


    async updateUserData(userId, data) {
        try {
            const query = { id: userId }

            const patchedUser = await this.User.findOneAndUpdate(query, data)
            return patchedUser
        } catch (err) {
            return {error: err.message}
        }
    } 


    async getUserById(id) {
        try {

            const user = await this.User.find({ id })
            return user

        } catch (err) {
            return {error: err.message}
        }
    }


    async getUserByUsername(username) {
        try {

            const user = await this.User.find({ username })
            return user

        } catch (err) {
            return { error: err.message }
        }
    }


    async listUser(userIds) {
        try {

            const users = await this.User.find({ id: { $in: [...userIds] } })
            return users

        } catch (err) {
            {error: err.message}
        }
    }


    async updateUserRooms(userId, rooms) {
        try {

            const query = { id: userId }
            const userPatch = { rooms }

            const patchedUser = await this.User.findOneAndUpdate(query, userPatch)
            return patchedUser

        } catch (err) {
            return {error: err.message}
        }
    }


    async updateMultiple(users) {
        try {

            let updatedUsers = []
            for(user of users) {
                const updatedUser = await User.findOneAndUpdate(user.id, user)
                updatedUsers.push(updatedUser)
            }
            return updatedUsers

        } catch (err) {
            return {error: err.message}
        }
    }

     
     async removeUser(userId) {
         try {

            const removedUser = await this.User.findOneAndDelete({ id: userId })
            return removedUser

         } catch (err) {
            return {error: err.message}
         }
     }
}

module.exports = UserRepository
