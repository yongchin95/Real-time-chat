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
    console.log('a user connected');
    //récupérer le pseudonyme de l'utilisateur 
    let pseudo = "";
    const stockagepseudo = function(clientvar){
    const pseudoserver = clientvar;
    socket.emit('chat message', 'Hi '+ pseudoserver);
    pseudo = pseudoserver;
    };
    //fonction lancée en cas d'event pseudo
    socket.on('pseudo', stockagepseudo);
    //ce qu'il se passe en cas de déconnection
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    // send chat messages back to the clientside
    socket.on('chat message', function(msg, stockagepseudo){
    io.emit('chat message', pseudo +" : " + msg);
    console.log('message: ' + msg);
    });
});

