const bcrypt = require("bcrypt")

module.exports = (password, hash) => {
    const areEqual = await bcrypt.compare(password, hash)
    return areEqual
}