const socket = io();
//fonction coté client pour récupérer la base de données, elle n'affiche pas encore l'objet reçu cependant
const getdata = async () => {
  const receive = await fetch("/load");
  const receivejson = await receive.json();
  console.log(receivejson);
};
getdata();

//récupérer le pseudo de l'utilisateur

let pseudo = window.prompt("Indiquez votre pseudo");
if (pseudo != "") {
  console.log(pseudo);
  socket.emit("pseudo", pseudo);
}
//récupérer les inputs du formulaire pour envoi au server
$("form").submit(async function(e) {
  e.preventDefault(); // eviter le reload
  scrollToEnd();
  const regex = new RegExp("[<>]", "g");
  let messagePreSanit = $("#m").val();
  //console.log(messagePreSanit);
  let messageSan = messagePreSanit.replace(regex, "");
  //console.log(messageSan);
  socket.emit("chat message", messageSan);
  $("#m").val("");
  //creation du timestamp
  let time = Math.floor(Date.now());

  console.log(time);
  //ceci va être recupéré serverside en faisant req.body.username par ex et fourré dans le modelschema
  const data = {
    username: pseudo,
    content: messageSan,
    timestamp: time
  };
  const options = {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(data)
  };
  //options est un objet
  console.log(options);
  const responseServer = await fetch("/send", options);
  const object = await responseServer.json();
  console.log(object);

  return false;
});

socket.on("chat connect", function(pseudoserver) {
  $("#messages").append($("<div class='connect'>").html(pseudoserver));
});

//récupérer l'event chat message emis par le server
socket.on("chat message", function(msg) {
  $("#messages").append($("<div>").html(msg));
});

socket.on("sendLink", function(link) {
  $("#messages").append($("<div class='clickMe'>").html(link));
});
socket.on("dbqueryall", function(allContent) {
  console.log(allContent);

  for (i = 0; i < allContent.length; i++) {
    $("#messages").prepend(
      $("<div>").html(allContent[i].username + ": " + allContent[i].content)
    );
  }
});
// auto scroll when msg is send
function scrollToEnd() {
  const container = document.getElementById("messages");
  container.scrollTop = container.scrollHeight;
}

document.getElementById("username").innerText = "Welcome " + pseudo;
