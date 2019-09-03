const MessageRoutes = require("./routes/message.routes")
const RoomRoutes = require("./routes/room.routes")
const UserRoutes = require("./routes/user.routes")

module.exports = (app) => {

    app.use("/api/v1/messages", MessageRoutes)
    app.use("/api/v1/rooms", RoomRoutes)
    app.use("/api/v1/users", UserRoutes)
    
}