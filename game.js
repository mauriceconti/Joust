\// Initialize canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Define player properties
const player = {
    x: 50,
    y: canvas.height / 2,
    width: 50,
    height: 50,
};

// Define game variables
let score = 0;
let lives = 3;
let gameSpeed = 1;
let lastEggTime = 0;
let lastBadTime = 0;
let backgroundX = 0;

// Load images
const playerImage = new Image();
playerImage.src = "bird.png";

const eggImage = new Image();
eggImage.src = "egg.png";

const badImage = new Image();
badImage.src = "bad.png";

// Main game loop
function gameLoop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    drawBackground();

    // Update player position
    updatePlayer();

    // Handle eggs
    handleEggs();

    // Handle bad guys
    handleBadGuys();

    // Draw score and lives
    drawScoreAndLives();

    // Check for collisions
    eggs.forEach((egg, index) => {
        egg.x -= 2 * gameSpeed;
        if (egg.x + egg.width < 0) {
            eggs.splice(index, 1);
        }
        ctx.drawImage(eggImage, egg.x, egg.y, egg.width, egg.height);
        checkCollision(egg, index);
    });

    badGuys.forEach((bad, index) => {
        bad.x -= 3 * gameSpeed;
        if (bad.x + bad.width < 0) {
            badGuys.splice(index, 1);
        }
        ctx.drawImage(badImage, bad.x, bad.y, bad.width, bad.height);
        checkCollision(bad, index);
    });

    // Update background position
    backgroundX -= 1 * gameSpeed;

    // Draw the background again at the new position to create a scrolling effect
    drawBackground();

    // Request the next frame
    requestAnimationFrame(gameLoop);
}

// Start the game loop
requestAnimationFrame(gameLoop);

// Function to draw background
function drawBackground() {
    ctx.drawImage(backgroundImage, backgroundX, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, backgroundX + canvas.width, 0, canvas.width, canvas.height);
}

// Function to update player position
function updatePlayer() {
    // Code to update player position
}

// Function to handle eggs
function handleEggs() {
    // Code to handle eggs
}

// Function to handle bad guys
function handleBadGuys() {
    // Code to handle bad guys
}

// Function to draw score and lives
function drawScoreAndLives() {
    // Code to draw score and lives
}

// Function to check collisions
function checkCollision(object, index) {
    // Code to check collision with player
}

// Function to handle losing a life
function loseLife() {
    // Flash the screen red
    flashScreen("red", 300);

    // Pause for 2 seconds
    setTimeout(() => {
        // Reset player position
        player.y = canvas.height / 2;

        // Reset game speed
        gameSpeed = 1; // Reset game speed to its initial value

        // Restart the game loop
        requestAnimationFrame(gameLoop);
    }, 2000); // Pause for 2 seconds (2000 milliseconds)
}

// Function to flash the screen
function flashScreen(color, duration) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, duration);
}
