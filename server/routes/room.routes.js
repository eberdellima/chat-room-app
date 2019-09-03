const express = require("express")
const router = express.Router

const RoomController = require('../controllers/Room.controller')

router.get("/list", (req, res) => {
    (new RoomController()).list(req, res)
})

router.post("/add", (req, res) => {
    (new RoomController()).create(req, res)
})

router.get("/:roomId/messages/:page", (req, res) => {
    (new RoomController()).get(req, res)
})

router.patch("/:roomId/update-users", (req, res) => {
    (new RoomController()).patch(req, res)
})

router.delete("/:roomId/remove-user", (req, res) => {
    (new RoomController()).delete(req, res)
})

module.exports = router