const Logger = require("../../config/logger")
const UserRepository = new (require("../repositories/User.repository"))()
const RoomRepository = new (require("../repositories/Room.repository"))()
const CounterRepository = new (require("../repositories/Counter.repository"))()

class UserController {

    async list(req, res) {
        try {

            const { roomId, userId } = req.body

            if (isNan(roomId)) {
                res.status(400).send("Invalid room number!")
            }

            const room = await RoomRepository.getRoomById(roomId)

            if (!room) {
                res.status(404).send("Room not found!")
            }

            if (room && room.error) {
                Logger(room.error, req.path)
                res.status(500).send({ error: room.error })
            }

            if (isNaN(userId)) {
                res.status(400).send("Invalid user ID!")
            }

            const user = await UserRepository.getUserById(userId)

            if (!user) {
                res.status(404).send("Usr not found!")
            }

            if (user && user.error) {
                Logger(user.error, req.path)
                res.status(500).send({ error: user.error })
            }

            const isUserInRoom = room.users.filter(roomUser => roomUser === user.id)[0]

            if (!isUserInRoom) {
                res.status(400).send("User not in room!")
            }

            let roomUsers = await UserRepository.listUser(room.users)
            roomUsers = roomUsers === null ? [] : roomUsers

            if (roomUsers && roomUsers.error) {
                Logger(roomUsers.error, req.path)
                res.status(500).send({ error: roomUsers.error })
            }

            res.status(200).send({ users: roomUsers })

        } catch (err) {
            Logger(err.message, req.path)
            res.status(500).send(err.message)
        }
    }


    async get(req, res) {
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
                res.status(500).send({ error: user.error })
            }

            res.status(200).send({ user: user })
            
        } catch (err) {
            Logger(err.message, req.path)
            res.status(500).send({ error: err.message})
        }
    }


    async add(req, res) {
        try {

            const username = req.body.username
            const password = req.body.password
            const icon = req.body.icon

            const existUsername = await UserRepository.getUserByUsername(username)

            if (existUsername) {
                res.status(409).send("Username not available!")
            }

            let userID = await CounterRepository.getUserCount()
            userID = userID === null ? 1 : userID

            if (userID && userID.error) {
                Logger(userID.error, req.path)
                res.status(500).send({ error: userID.error })
            }

            const newUser = await UserRepository.createUser({username, password, icon, id: userID})

            if (newUser && newUser.error) {
                Logger(newUser.error, req.path)
                res.status(500).send({ error: newUser.error})
            }

            userID += 1

            const newUserCount = await CounterRepository.setUserCount(userID)

            if (newUserCount && newUserCount.error) {
                Logger(newUserCount.error, req.path)
                res.status(500).send({ error: newUserCount.error })
            }

            res.status(201).send({ user : newUser })

        } catch (err) {
            Logger(err.message, req.path)
            res.status(500).send({ error: err.message })
        }
    }


    async patch(req, res) {
        try {

            const { username, password, userId } = req.body

            if (!username || !password) {
                res.status(400).send("Invalid username or password!")
            }

            const existingUser = await UserRepository.getUserByUsername(username)
            const exists = existingUser === null
            const sameUser = existingUser.id === userId
            const samePassword = existingUser.password === password

            if (exists) {

                if (sameUser && samePassword) {
                    res.status(200).send({ user: existingUser })
                }
                
                if (sameUser && !samePassword) {

                    existingUser.password = password
                    const updatedUser = await UserRepository.updateUserData(userId, existingUser)

                    if (updatedUser && updatedUser.error) {
                        Logger(updatedUser.error, req.path)
                        res.status(500).send({ error: updatedUser.error })
                    }

                    res.status(200).send({ user: updatedUser })
                }

            } else {

                const actualUser = await UserRepository.getUserById(userId)

                if (!actualUser) {
                    res.status(404).send("User not found!")
                }

                if (actualUser && actualUser.error) {
                    Logger(actualUser.error, req.path)
                    res.status(500).send({ error: actualUser.error })
                }

                actualUser.username = username

                if (actualUser.password !== password) {
                    actualUser.password = password
                }

                const updatedUser = await UserRepository.updateUserData(userId, actualUser)

                if (updatedUser && updatedUser.error) {
                    Logger(updatedUser.error, req.path)
                    res.status(500).send({ error: updatedUser.error })
                }

                res.status(200).send({ user: actualUser })

            }

        } catch (err) {
            Logger(err.message, req.path)
            res.status(500).send({ error: err.message })
        }
    }


    async remove() {
        try {

            const userId = req.body.userID

            if (isNaN(userId)) {
                res.status(400).send("Invalid user ID")
            }

            const user = await UserRepository.getUserById(userId)

            if (!user) {
                res.status(404).send("User not found!")
            }

            if (user && user.error) {
                Logger(user.error, req.path)
                res.status(500).send({ error: user.error })
            }

            let rooms = await RoomRepository.listRoomsById(user.rooms)
            rooms = rooms === null ? [] : rooms

            if (rooms && rooms.error) {
                Logger(rooms.error, req.path)
                res.status(500).send({ error: rooms.error })
            }

            if (rooms.length > 0) {
                rooms.map(room => {
                    room.users = [...room.users].filter( u => u.username !== user.username )
                    return room
                })
            }

            const updatedRooms = await RoomRepository.updateMultiple(rooms)

            if (updatedRooms && updatedRooms.error) {
                Logger(updatedRooms.error, req.path)
                res.status(500).send({ error: updatedRooms.error })
            }

            const removedUser = await UserRepository.removeUser(userId)

            if (removedUser && removedUser.error) {
                Logger(removedUser.error, req.path)
                res.status(500).send({ error: removedUser.error })
            }

            res.status(200).send({ user: removedUser })

        } catch (err) {
            Logger(err.message, req.path)
            res.status(500).send({ error: err.message })
        }
    }
}

module.exports = UserController
