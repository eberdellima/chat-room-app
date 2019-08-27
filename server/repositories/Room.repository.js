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
            return {error: err.message}
        }
    }


    async listRoomsById(roomIds) {
        try {

            const rooms = await this.Room.find({ id: { $in: [...roomIds] } })
            return rooms

        } catch (err) {
            return {error: err.message}
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
            return {error: err.message}
        }
    }

   async updateMultiple(rooms) {
       try {

            let updatedRooms = []
            for (room of rooms) {
                const updatedRoom = await this.Room.findOneAndUpdate(room.id, room)
                updatedRooms.push(updatedRoom)
            }
            return updatedRooms

       } catch (err) {
           return {error: err.message}
       }
   }


    async updateRoomMembers(roomId, users) {
        try {

            const roomPatch = { members: [...users] }
            const query = { room_id: roomId}

            const patchedRoom = await this.Room.findOneAndUpdate(query, roomPatch)
            return patchedRoom
        
        } catch (err) {
            return {error: err.message}
        }
    }

    
    async removeRoom(roomId) {
        try {

            const removedRoom = await this.Room.findOneAndDelete({ id: roomId })
            return removedRoom

        } catch (err) {
            return {error: err.message}
        }
    }
}

module.exports = RoomRepository
