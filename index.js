const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

// Testing if the socket works
app.get('/', (req, res) => {
    res.send('hello')
})


io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('is_online', '<i>' + socket.username + ' join the chat..</i>');
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', '<i>' + socket.username + ' left the chat..</i>');
    })

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

});


const server = http.listen(3330, () => { console.log('working')})
