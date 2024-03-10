var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// Adjust the canvas size for responsiveness
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas, false);
resizeCanvas();

var score = 0;
// Score display could be improved or integrated within the canvas for mobile compatibility
var scoreText = document.createElement('div');
scoreText.style.position = 'absolute';
scoreText.style.color = 'white';
scoreText.style.top = '20px';
scoreText.style.left = '20px';
scoreText.style.fontSize = '24px';
scoreText.textContent = "Score: 0";
document.body.appendChild(scoreText);

var birdImage = new Image();
birdImage.src = 'https://github.com/mauriceconti/Joust/blob/main/bird.png?raw=true'; // Update URL

var eggImage = new Image();
eggImage.src = 'https://github.com/mauriceconti/Joust/blob/main/egg.png?raw=true'; // Update URL

var backgroundImage = new Image();
backgroundImage.src = 'https://github.com/mauriceconti/Joust/blob/main/sky.png?raw=true'; // Update URL

var player = { x: 100, y: canvas.height / 2, dy: 0, width: 60, height: 45 }; // Adjusted for smaller size
var gravity = 0.25;
var lift = -6;
var eggs = [];
var eggFrequency = 2000;
var lastEggTime = 0;

var scrollSpeed = 0.5;
var backgroundX = 0;

function drawPlayer() {
    ctx.drawImage(birdImage, player.x, player.y, player.width, player.height);
}

function updateBackground() {
    backgroundX -= scrollSpeed;
    if (backgroundX <= -canvas.width) {
        backgroundX = 0;
    }
}

function drawBackground() {
    ctx.drawImage(backgroundImage, backgroundX, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, backgroundX + canvas.width, 0, canvas.width, canvas.height);
}

function createEgg() {
    var now = Date.now();
    if (now - lastEggTime > eggFrequency) {
        var egg = { x: canvas.width, y: Math.random() * (canvas.height - 30), width: 30, height: 40 };
        eggs.push(egg);
        lastEggTime = now;
    }
}

function moveEggs() {
    for (var i = eggs.length - 1; i >= 0; i--) {
        eggs[i].x -= 2;
        if (eggs[i].x + eggs[i].width < 0) {
            eggs.splice(i, 1);
        }
    }
}

function drawEggs() {
    eggs.forEach(function(egg) {
        ctx.drawImage(eggImage, egg.x, egg.y, egg.width, egg.height);
    });
}

function checkCollision() {
    eggs.forEach(function(egg, index) {
        if (player.x < egg.x + egg.width &&
            player.x + player.width > egg.x &&
            player.y < egg.y + egg.height &&
            player.y + player.height > egg.y) {
            score += 100;
            scoreText.textContent = "Score: " + score;
            eggs.splice(index, 1); // Remove the egg from the array
        }
    });
}

function updatePhysics() {
    player.dy += gravity;
    player.y += player.dy;

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
    } else if (player.y < 0) {
        player.y = 0;
        player.dy = 0;
    }
}

// Add touch event listeners for mobile controls
function touchStart(e) {
    player.dy = lift;
    e.preventDefault(); // Prevent scrolling when touching the canvas
}

canvas.addEventListener('touchstart', touchStart);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    updateBackground();
    createEgg();
    moveEggs();
    drawEggs();
    updatePhysics();
    drawPlayer();
    checkCollision();
    requestAnimationFrame(draw);
}

// Wait for images to load
let assetsLoaded = 0;
function assetLoaded() {
    assetsLoaded++;
    if (assetsLoaded === 3) { // 3 assets: bird, egg, background
        draw(); // Start the game loop when all assets are loaded
    }
}

birdImage.onload = assetLoaded;
eggImage.onload = assetLoaded;
backgroundImage.onload = assetLoaded;
