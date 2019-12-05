const socket = io('/drawingPepeWithMyBFF.html');

function setup() {
    createCanvas(800, 800);
    background(0);
}


function mouseDragged() {
    noStroke();
    fill(255);
    ellipse(mouseX, mouseY, 35, 35);
    socket.emit('drawing', mouseX, mouseY);
}

socket.on('sendDrawing', (x, y) => {
    console.log("in");
    noStroke();
    fill(255, 0, 0);
    ellipse(x, y, 35, 35);
});

socket.on('refreshCanvas', () => {
    background(0);
})