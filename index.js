const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const router = require('./server/routes/index')
const SocketEventHandler = require('./server/socket-events/index.js')

app.use('/', router)
http.listen(3330, () => { console.log('working')})


io.sockets.on('connection', function(socket) {
    SocketEventHandler(socket)
});
