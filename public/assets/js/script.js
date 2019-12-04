const socket = io();

//récupérer le pseudo de l'utilisateur
let pseudo = window.prompt('Indiquez votre pseudo', 'anonymous');
    if (pseudo != ""){
    console.log(pseudo);
    socket.emit('pseudo', pseudo);
    };
//récupérer les inputs du formulaire pour envoi au server
$('form').submit(function(e){
          e.preventDefault(); // eviter le reload
          socket.emit('chat message', $('#m').val());
          $('#m').val('');
          return false;
    });
//récupérer l'event chat message emis par le server    
socket.on('chat message', function(msg){
        $('#messages').append($('<li>').html(msg));
    });
socket.on('dbqueryall', (allContent) => {
        $('#messages').append($('<li>').text(msg));
    });

