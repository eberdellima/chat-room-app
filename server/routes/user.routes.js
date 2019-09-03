const express = require("express")
const router = express.Router()

const UserController = require("../controllers/User.controller")

router.get("/list/room/:roomId", (req, res) => {
    (new UserController()).list(req, res)
})
body
router.get("/:userId", (req, res) => {
    (new UserController()).get(req, res)
})

router.post("/add", (req, res) => {
    (new UserController()).add(req, res)
})

router.patch("/:userId/update-data", (req, res) => {
    (new UserController()).patch(req, res)
})

router.delete("/:userId/remove", (req, res) => {
    (new UserController()).remove(req, res)
})

module.exports = router