const MessageController = require("../controllers/Message.controller")

/**
 * There will be changes to the following methods 
 * beacuse previous implementation was based on http 
 */

module.exports = (io) => {

    io.on('/messages/add/request', async(data) => {
        const result = await (new MessageController()).add(data)
        io.emit('/messages/add/response', result)
    })

    io.on('/messages/remove/:messageId/request', async(data) => {
        const result = await (new MessageController()).remove(data)
        io.emit('/messages/remove/:messageId/response', result)
    })

}