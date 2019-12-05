const express = require('express');
const mongoose = require('mongoose');
const app = express();
const http = require('http');
var server = http.createServer(app);
const io = require('socket.io').listen(server);
const port = process.env.PORT || 3000;
const marked = require('marked');
require('dotenv').config();
// require d'apres le chemin de l'index du server
const Content = require('./models/content')
//bodyparser is included in express
//.urlencoded is a bodyparser stuff included in express now
const drawing = io.of('/drawingPepeWithMyBFF.html');

//connect to db
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(test => {
    console.log('Connectedbg');
  })
  .catch(err => console.log(err));



server.listen(port, function () {
  console.log('listening on *:3000');
});
//ne pas oublier de dire au server ce qu'il va recevoir par ex du json
app.use(express.json());
// le server va servir les pages qui sont dans le folder public
app.use(express.static('public'));
// comment recevoir des trucs de la banque de données
app.get('/load', async (req, res, next) => {
  const allContent = await Content.find()
  await res.status(200).json({
    content: allContent
  })
  io.emit('dbqueryall', allContent);
});
// comment envoyer des trucs à la base de donnée: récupérer le req.body puis tapper dans le model puis envoyer
app.post('/send', async (req, res, next) => {
  //créer un nouvel objet du meme type que le schema, qui respecte ça
  if (req.body.content == "!drawing") {
    res.json({
      message: ("<a href='drawingPepeWithMyBFF.html'> CLICK ME</a>")
    })
  }
  const nouvelobjet = await new Content({
    username: req.body.username,
    content: req.body.content,
    timestamp: req.body.timestamp
  })
    //console.log(nouvelobjet);

  await nouvelobjet.save();
  console.log(nouvelobjet);
  res.status(200).json({
    message: 'objet créé',
    objet: nouvelobjet
  });
});

app.delete('/:messageId', async (req, res) => {
  const id = req.params.messageId;
  const deletedProduct = await Content.deleteOne({
    _id: id
  });
  res.json({
    message: "C est delete mamen",
    deleted: deletedProduct
  })
})

io.on('connection', function (socket) {
  console.log('a user connected');
  //récupérer le pseudonyme de l'utilisateur 
  let pseudo = "";
  const stockagepseudo = function (clientvar) {
    const pseudoserver = clientvar;
    socket.emit('chat message', marked('*Bienvenue* ' + pseudoserver));
    pseudo = pseudoserver;
  };
  //fonction lancée en cas d'event pseudo
  socket.on('pseudo', stockagepseudo);
  //ce qu'il se passe en cas de déconnection
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
  // send chat messages back to the clientside
  socket.on('chat message', function (msg, stockagepseudo) {
    io.emit('chat message', pseudo + " : " + marked(msg));
    console.log('message: ' + msg);
  });
});

drawing.on('connection', function (socket) {
  console.log('a player is here to play the best game ever');
  socket.on('drawing', (x, y) => {
    console.log("X :" + x + " Y: " +
      y);
    socket.broadcast.emit('sendDrawing', x, y);
  })
  socket.on('disconnect', () => {
    drawing.emit('refreshCanvas');
  })
});
