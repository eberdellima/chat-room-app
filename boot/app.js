const express = require('express')
const app = express()

require('dotenv').config()
require('./redis')
require('./database')
require('./server')(app)
require('./routes')(app)
require('./socket')(app)


module.exports = app