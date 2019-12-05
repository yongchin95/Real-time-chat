const socket = io('/snake.html');



// The snake mamen
let cell = 20;
let snake = new Snake();
let fruit = new Fruit();
let inGame = true;
let score = 0;
let speed = 10;
const snakes = [];

function setup() {
    let myCanvas = createCanvas(1000, 600);
    myCanvas.parent("mainDiv");
    frameRate(speed);
    snakes.push(snake);
    document.getElementById("playAgain").style.display = "none";
}

console.log(score);

function draw() {
    background(150);
    fruit.generate();

    if (inGame == true) {
        if (snake.x === fruit.x && snake.y == fruit.y) {
            snake.eat();
            fruit.newPosition();
            fruit.generate();
            score++;
            console.clear();
            console.log("score: " + score);
            snakes.push(new Snake());
            if (score >= 5) {
                score += 2;
            } else if (score >= 15) {
                score += 3;
            } else if (score >= 30) {
                score += 5;
            } else if (score >= 50) {
                score += 10;
            }
            speed++;
            frameRate(speed);
            console.log("speed: " + speed);
        }

        for (let i = snakes.length - 1; i > 0; i--) {
            snakes[i].newPosition(snakes[i - 1].x, snakes[i - 1].y);
            socket.emit('moving', snakes[i].x, snakes[i].y);
            snakes[i].display();
        }

        snake.move();
        snake.display();
        snake.keyPressed();
        snake.checkIfDead();

        snakes.forEach((s, i) => {
            if (i > 0) {
                if (s.x === snake.x && s.y === snake.y) {
                    inGame = !inGame;
                }
            }
        });
    }
}