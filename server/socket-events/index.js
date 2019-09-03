const roomEvents = require("./room-events")
const userEvents = require("./user-events")
const messageEvents = require("./message-events")

module.exports = (io) => {
    roomEvents(io)
    userEvents(io)
    messageEvents(io)
}