const socket = io();
//fonction coté client pour récupérer la base de données, elle n'affiche pas encore l'objet reçu cependant
const getdata = async () => {
    const receive = await fetch("/load");
    const receivejson = await receive.json();
    console.log(receivejson);
}; 
getdata();

//récupérer le pseudo de l'utilisateur
let pseudo = window.prompt('Indiquez votre pseudo', 'anonymous');
    if (pseudo != ""){
    console.log(pseudo);
    socket.emit('pseudo', pseudo);
    };
//récupérer les inputs du formulaire pour envoi au server
$('form').submit(async function(e){
            e.preventDefault(); // eviter le reload
            socket.emit('chat message', $('#m').val());
            let message = $('#m').val();
            console.log(message);
            $('#m').val('');
    //ceci va être recupéré serverside en faisant req.body.username par ex et fourré dans le modelschema
            const data ={
                username:pseudo,
                content:message
            };
            const options = {
                method:'POST',
                headers:{
                'Content-type':'application/json'
                },
                body:JSON.stringify(data)
            };
//options est un objet
            console.log(options);
            await fetch('/send', options)

            return false;
    });
//récupérer l'event chat message emis par le server  
socket.on('chat message', function(msg){

        $('#messages').append($("<div>").html(msg));
    });
socket.on('dbqueryall', (allContent) => {
        //$('#messages').append($('<li>').text(msg));
    });

