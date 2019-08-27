const bcrypt = require("bcrypt")
const saltRounds = 10

module.exports = async (req, res, next) => {
    const password = req.body.password
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(password, salt)
    req.body.password = hash
    next()
}