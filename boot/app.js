const express = require('express')
const app = express()

require('dotenv').config()
require('./redis')
require('./database')
require('./server')(app)
require('./routes')(app)


module.exports = app