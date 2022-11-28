let snake;
let rez = 20;
let food;
let w;
let h;
let high_score;

let classifier;

// Label
let label = 'listening...';

// Teachable Machine model URL:
let soundModel = 'https://teachablemachine.withgoogle.com/models/vUwAawGw9/';

function preload() {
    // Load the model
    classifier = ml5.soundClassifier(soundModel + 'model.json');
}

function setup() {
    createCanvas(400, 400);
    //add Class
    document.getElementById("defaultCanvas0").classList.add("m-auto", 'mt-10', 'shadow-lg', 'rounded-lg')

    classifyAudio();

    w = floor(width / rez);
    h = floor(height / rez);
    frameRate(5);
    snake = new Snake();
    foodLocation();

    //check LocalStorage
    high_score = localStorage.getItem("HighScore");
    if (!high_score) {
        localStorage.setItem("HighScore", snake.getScore());
    }

    if (high_score !== 0) {
        document.getElementById("high_score").innerHTML = high_score;
    } else {
        document.getElementById("high_score").innerHTML = 0;
    }
}

function classifyAudio() {
    classifier.classify(gotResult);

}

function foodLocation() {
    let x = floor(random(w));
    let y = floor(random(h));
    food = createVector(x, y);

}

function controlSnake() {
    if (label === 'kiri') {
        snake.setDir(-1, 0);
    } else if (label === 'kanan') {
        snake.setDir(1, 0);
    } else if (label === 'bawah') {
        snake.setDir(0, 1);
    } else if (label === 'atas') {
        snake.setDir(0, -1);
    }
}

// function keyPressed() {
//     if (keyCode === LEFT_ARROW) {
//         snake.setDir(-1, 0);
//     } else if (keyCode === RIGHT_ARROW) {
//         snake.setDir(1, 0);
//     } else if (keyCode === DOWN_ARROW) {
//         snake.setDir(0, 1);
//     } else if (keyCode === UP_ARROW) {
//         snake.setDir(0, -1);
//     } else if (key == ' ') {
//         snake.grow();
//     }

// }

function draw() {
    scale(rez);
    background(220);
    if (snake.eat(food)) {
        foodLocation();
    }
    snake.update();
    snake.show();

    let score = snake.getScore();
    document.getElementById("score").innerHTML = score;

    if (snake.endGame()) {
        print("END GAME");
        background(255, 0, 0);
        noLoop();

        if (score > high_score) {
            localStorage.setItem("HighScore", score);
        }
        document.getElementById('restart').classList.remove('hidden')
    }

    noStroke();
    fill(255, 0, 0);
    rect(food.x, food.y, 1, 1);
}

function gotResult(error, results) {
    if (error) {
        console.error(error);
        return;
    }
    // The results are in an array ordered by confidence.
    // console.log(results[0]);
    label = results[0].label;
    controlSnake();
    console.log(label)
}