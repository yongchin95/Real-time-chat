const express = require('express');
const app = express();
const http = require('http');
var server = http.createServer(app);
const io = require('socket.io').listen(server);


server.listen(3000, function(){
  console.log('listening on *:3000');
});

app.use(express.static('public'));

io.on('connection', function(socket){
    socket.broadcast.emit('hi new user');
    console.log('a user connected');
    
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log('message: ' + msg);
    });
});

