const Logger = require('../../config/logger')
const RoomRepository = new (require('../repositories/Room.repository'))()
const CounterRepository =  new (require('../repositories/Counter.repository'))()
const UserRepository = new (require('../repositories/User.repository'))()
const MessageRepository = new (require('../repositories/Message.repository'))()


class RoomController {

    async list (req, res) {
        try {

            const userId = req.body.userId

            if (isNaN(userId)) {
                res.status(400).send("Invalid user ID!")
            }

            const user = await UserRepository.getUserById(userId)

            if (!user) {
                res.status(404).send("User not found!")
            }

            if (user && user.error) {
                Logger(user.error, req.path)
                res.status(500).send({ error: user.error})
            }

            let rooms = await RoomRepository.listRoomsById(user.rooms)
            rooms = rooms === null ? [] : rooms

            if (rooms && rooms.error) {
                Logger(rooms.error, req.path)
                res.status(500).send({ error: rooms.error })
            }

            res.status({ rooms: rooms })

        } catch (err) {
            Logger(err.message, req.path)
            res.status(500).send({ error: err.message })
        }
    }


    async create(req, res) {
        try {

            let roomId = CounterRepository.getRoomCount()
            roomId = roomId.room_count
            roomId = roomId === null ? 1 : roomId

            const members = req.body.members
            let users = UserRepository.listUser(members)
           
            if (!users) {
                res.status(404).send('Users not found!')
            }

            if (users && users.error) {
                Logger(users.error, req.path)
                res.status(500).send({ error: users.error})
            }

            let mappedUsers = users.map( user => user.username )
            const newRoom = RoomRepository.addRoom(roomId, mappedUsers)

            if (!newRoom) {
                res.status(409).send('Room not created!')
            }

            if (newRoom && newRoom.error) {
                Logger(newRoom.error, req.path)
                res.status(500).send({ error: newRoom.error})
            }

            for(user of users) {
                user.rooms = [...user.rooms, newRoom.id]
            }
            
            let updatedUsers = await UserRepository.updateMultiple(users)
            updatedUsers = updatedUsers === null ? [] : updatedUsers
            
            if(updatedUsers && updatedUsers.error) {
                Logger(updatedUsers.error, req.path)
                res.status(500).send({ error: updatedUsers.error })
            }

            updatedUsers = updatedUsers.map(user => ({name: user.username, id: user,id}))

            roomId  += 1
            let newRoomCount = await CounterRepository.setRoomCount(roomId)

            if (newRoomCount && newRoomCount.error) {
                Logger(newRoomCount.error, req.path)
                res.status(500).send({ error: newRoomCount.error})
            }

            res.status(201).send({room: newRoom, users: updatedUsers}) 

        } catch (err) {
            Logger(err.message, req.path)
            res.status(500).send({ error: err.message})
        }
    }


    async get(req, res) {
        try {

            const roomId = req.body.roomId
            let page = parseInt(req.params.page)
            
            if(isNaN(roomId)) {
                res.status(400).send("Invalid room number!")
            }

            const room = await RoomRepository.getRoomById(roomId)
            
            if (!room) {
                res.status(404).send("Room not found!")
            }

            if (room && room.error) {
                Logger(room.error, req.path)
                res.status(500).send({error: room.error})
            }

            if(isNaN(page)) {
                res.status(400).send("Invalid URL!")
            }

            page = page < 1 ? 1 : page

            let messages = await MessageRepository.getMessagesByRoom(room.id, page)
            messages = messages === null ? [] : messages
            
            if (messages && messages.error) {
                Logger(messages.error, req.path)
                res.status(500).send({error: messages.error})
            }

            let users = await UserRepository.listUser(room.users)
            users = users === null ? [] : users
            
            if (users && users.error) {
                Logger(users.error, req.path)
                res.status(500).send({error: users.error})
            }

            res.status(200).send({ room , messages, users })

        } catch (err) {
            Logger(err.message, req.path)
            res.status(500).send({ error: err.message })
        }
    }


    async patch(req, res) {
        try {

            const roomId = req.body.roomId
            const userToRemove = req.body.userId

            if (isNaN(roomId)) {
                res.status(400).send("Invalid room number!")
            }

            const room = await RoomRepository.getRoomById(roomId)

            if (!room) {
                res.status(404).send("Room not found!")
            }

            if (room && room.error) {
                Logger(room.error, req.path)
                res.status(500).send({error: room.error})
            }

            const user = await UserRepository.getUserById(userToRemove)

            if (!user) {
                res.status(404).send("User not found!")
            }

            if (user && user.error) {
                Logger(user.error, req.path)
                res.status(500).send({ error: user.error })
            }

            const updatedUsers = room.users.filter( user => user !== userToRemove )
            if (updatedUsers.length === room.users.length) {
                res.status(404).send("User not in room!")
            }

            const updatedRooms = user.rooms.filter( room => room.id !== roomId )
            if (updatedRooms.length === user.rooms.length) {
                res.status(404).send("User not in room!")
            }

            room.user = updatedUsers
            user.rooms = updatedRooms

            const updatedUser = await UserRepository.updateUserRooms(userToRemove, user)

            if(updatedUser && updatedUser.error) {
                Logger(updatedUser.error,req.path)
                res.status(500).send({error: updatedUser.error})
            }

            const updatedRoom = await RoomRepository.updateRoomMembers(roomId, room)

            if(updatedRoom && updatedRoom.error) {
                Logger(updatedRoom.error,req.path)
                res.status(500).send({error: updatedRoom.error})
            }

            res.status(200).send({ room: updatedRoom })

        } catch (err) {
            Logger(err.message, req.path)
            res.status(500).send({ error: err.message })
        }
    }


    async remove(req, res) {
        try {

            const roomId = req.body.roomId
            const userId = req.body.userId

            if (isNaN(roomId)) {
                res.status(400).send("Invalid room number!")
            }

            const room = await RoomRepository.getRoomById(roomId)

            if (!room) {
                res.status(404).send("Room not found!")
            }

            if (room && room.error) {
                Logger(room.error, req.path)
                res.status(500).send({error: room.error})
            }

            let user = await UserRepository.getUserById(userId)

            if (!user) {
                res.status(404).send("User not found!")
            }

            if (user && user.error) {
                Logger(user.error, req.path)
                res.status(500).send({ error: user.error })
            }

            const isUserInRoom = room.users.find( roomUser => roomUser === user.username )
            if (!isUserInRoom) {
                res.status(404).send("User not in room!")
            }

            let roomUsers = await UserRepository.listUser(room.users)
            roomUsers = roomUsers === null ? [] : roomUsers

            if (roomUsers && roomUsers.error) {
                Logger(roomUsers.error, req.path)
                res.status(500).send({ error: roomUsers.error })
            }

            roomUsers = roomUsers.map( roomUser => {
                roomUser.rooms = [...roomUser.rooms].filter( room => room !== roomId )
            })

            user = roomUsers.filter( roomUser => roomUser.id === user.id )[0]

            const updatedRoom = await RoomRepository.removeRoom(roomId)

            if (updatedRoom && updatedRoom.error) {
                Logger(updatedRoom.error, req.path)
                res.status(500).send(updatedRoom.error)
            }

            const updateUsers = await UserRepository.updateMultiple(roomUsers)

            if (updateUsers && updateUsers.error) {
                Logger(updateUsers.error, req.path)
                res.status(500).send(updateUsers.error)
            }

            const deleteMessages = await MessageRepository.removeRoomMessages(roomId)

            if (deleteMessages && deleteMessages.error) {
                Logger(deleteMessages.error, req.path)
                res.status(500).send(deleteMessages.error)
            }

            res.status(200).send({ user })

        } catch (err) {
            Logger(err.message, req.path)
            res.status(500).send({ error: err.message})
        }
    }


    async leave(req, res) {
        try {

            

        } catch (err) {
            Logger(err.message, req.path)
            res.status(500).send({ error: err.message })
        }
    }

}

module.exports = RoomController
