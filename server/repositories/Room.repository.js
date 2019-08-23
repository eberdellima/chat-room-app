const Room = require('../models/Room.model')

class RoomRepository {

    constructor(odm) {
        if(RoomRepository.exists) {
            return RoomRepository.instance
        }
        this.Room = Room(odm)
        RoomRepository.exists = true
        RoomRepository.instance = this
    }


    async getRoomById(roomId) {
        try {

            const room = await this.Room.find({ id: roomId })
            return room

        } catch (err) {
            return { logInfo: {
                level: "Error",
                message: err.message,
                timestamp: Date.now()
            }}
        }
    }


    async listRoomsById(roomIds) {
        try {

            const rooms = await this.Room.find({ id: { $in: [...roomIds] } })
            return rooms

        } catch (err) {
            return { logInfo: {
                level: "Error",
                message: err.message,
                timestamp: Date.now()
            }}
        }
    }


    async addRoom(roomId, users) {
        try {

            const room = new this.Room({
                id: roomId,
                members: [...users]
            })
            const savedRoom = await room.save()
            return savedRoom

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


    async updateRoomMembers(roomId, users) {
        try {

            const roomPatch = { members: [...users] }
            const query = { room_id: roomId}

            const patchedRoom = await this.Room.findOneAndUpdate(query, roomPatch)
            return patchedRoom
        
        } catch (err) {
            return { logInfo: {
                level: "Error",
                message: err.message,
                timestamp: Date.now()
            }}
        }
    }

    
    async removeRoom(roomId) {
        try {

            const removedRoom = await this.Room.findOneAndDelete({ id: roomId })
            return removedRoom

        } catch (err) {
            return { logInfo: {
                level: "Error",
                message: err.message,
                timestamp: Date.now()
            }}
        }
    }
}

module.exports = RoomRepository
