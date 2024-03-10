var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var score = 0;
var lives = 3;
var gameSpeed = 1;
var badGuys = [];

// Load assets
var birdImage = new Image();
var eggImage = new Image();
var badImage = new Image();
var backgroundImage = new Image();
birdImage.src = 'path/to/bird.png'; // Update path
eggImage.src = 'path/to/egg.png'; // Update path
badImage.src = 'path/to/bad.png'; // Update path
backgroundImage.src = 'path/to/sky.png'; // Update path

var player = { x: 100, y: canvas.height / 2, dy: 0, width: 60, height: 45 };
var gravity = 0.25;
var lift = -5;
var eggs = [];
var eggFrequency = 2000;
var badFrequency = 5000;
var lastEggTime = 0;
var lastBadTime = 0;

var scrollSpeed = 0.5;
var backgroundX = 0;

// Responsive design and touch controls
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    player.y = canvas.height / 2;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

canvas.addEventListener('touchstart', function() { player.dy = lift; });
document.addEventListener('keydown', function(event) {
    if (event.key === "ArrowUp") { player.dy = lift; }
});

function drawBackground() {
    backgroundX -= scrollSpeed * gameSpeed;
    if (backgroundX <= -canvas.width) { backgroundX = 0; }
    ctx.drawImage(backgroundImage, backgroundX, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, backgroundX + canvas.width, 0, canvas.width, canvas.height);
}

function drawPlayer() { ctx.drawImage(birdImage, player.x, player.y, player.width, player.height); }

function createEgg() {
    if (Date.now() - lastEggTime > eggFrequency / gameSpeed) {
        var egg = { x: canvas.width, y: Math.random() * (canvas.height - 30), width: 30, height: 40 };
        eggs.push(egg);
        lastEggTime = Date.now();
    }
}

function createBadGuy() {
    if (Date.now() - lastBadTime > badFrequency / gameSpeed) {
        var bad = { x: canvas.width, y: Math.random() * (canvas.height - 50), width: 50, height: 60 };
        badGuys.push(bad);
        lastBadTime = Date.now();
    }
}

function updateObjects(objects) {
    objects.forEach(function(obj, index) {
        obj.x -= (2 * gameSpeed);
        if (obj.x + obj.width < 0) { objects.splice(index, 1); }
    });
}

function drawObjects(objects, image) {
    objects.forEach(function(obj) { ctx.drawImage(image, obj.x, obj.y, obj.width, obj.height); });
}

function checkCollisions(objects) {
    objects.forEach(function(obj, index) {
        if (player.x < obj.x + obj.width && player.x + player.width > obj.x &&
            player.y < obj.y + obj.height && player.y + player.height > obj.y) {
            objects.splice(index, 1);
            return true;
        }
    });
    return false;
}

function updateGame() {
    if (checkCollisions(badGuys)) {
        lives--;
        if (lives <= 0) {
            alert("Game Over!!");
            document.location.reload();
        }
    }
    if (checkCollisions(eggs)) {
        score += 100;
        if (score % 1000 === 0) { gameSpeed += 0.1; }
    }
}

function drawScore() {
    ctx.font = "20px Futura";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Score: " + score + " Lives: " + lives, 10, 30);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    createEgg();
    createBadGuy();
    updateObjects(eggs);
    updateObjects(badGuys);
    drawObjects(eggs, eggImage);
    drawObjects(badGuys, badImage);
    drawPlayer();
    updateGame();
    drawScore();
    player.dy += gravity;
    player.y += player.dy;
    requestAnimationFrame(draw);
}

birdImage.onload = draw; // Start the game once the bird image has loaded
