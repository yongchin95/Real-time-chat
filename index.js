require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const http = require('http');
var server = http.createServer(app);
const io = require('socket.io').listen(server);

//connect to db

mongoose
  .connect(process.env.DB_CONNECT,  { 
    useNewUrlParser: true,
    useUnifiedTopology: true 
  })
  
  .then(test => {
    console.log('Connectedbg');
  })
  .catch(err => console.log('Failed to connect bg'));


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

