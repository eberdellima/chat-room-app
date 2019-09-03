const express = require("express")
const router = express.Router()

const MessageController = require("../controllers/Message.controller")

router.post("/remove/:messageId", (req, res) => {
    (new MessageController()).remove(req, res)
})

router.post("/add", (req, res) => {
    (new MessageController()).add(req, res)
})

module.exports = router