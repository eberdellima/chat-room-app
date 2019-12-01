const express = require('express')
const app = express()

require('dotenv').config()
require('./server')(app)
require('./redis')
require('./database')


module.exports = app