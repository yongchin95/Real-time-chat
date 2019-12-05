const socket = io('/drawingPepeWithMyBFF.html');

function setup() {
    createCanvas(800, 800);
    background(0);
}


function mouseDragged() {
    noStroke();
    let r = random(0, 255);
    let g = random(0, 255);
    let b = random(0, 255);
    fill(r, g, b);
    ellipse(mouseX, mouseY, 100, 100);
    socket.emit('drawing', mouseX, mouseY);
}

socket.on('sendDrawing', (x, y) => {
    console.log("in");
    noStroke();
    let r = random(0, 255);
    let g = random(0, 255);
    let b = random(0, 255);
    fill(r, g, b);
    ellipse(x, y, 100, 100);
});

socket.on('refreshCanvas', () => {
    background(0);
})