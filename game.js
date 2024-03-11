document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startButton');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const messageDiv = document.getElementById('message');
    canvas.width = 800;
    canvas.height = 600;

    let gameRunning = false;
    let assetsLoaded = false;
    let assets = {};
    let player, eggs, bads, background;
    let score = 0;
    let lives = 3;
    const gravity = 0.5;
    const lift = -10;

    // Load assets
    function loadAssets(callback) {
        const assetSources = {
            sky: 'https://github.com/mauriceconti/Joust/raw/main/sky.png',
            bird: 'https://github.com/mauriceconti/Joust/raw/main/bird.png',
            egg1: 'https://github.com/mauriceconti/Joust/raw/main/egg1.png',
            egg2: 'https://github.com/mauriceconti/Joust/raw/main/egg2.png',
            egg3: 'https://github.com/mauriceconti/Joust/raw/main/egg3.png',
            bad: 'https://github.com/mauriceconti/Joust/raw/main/bad.png',
        };
        let assetsLoaded = 0;
        let totalAssets = Object.keys(assetSources).length;

        Object.keys(assetSources).forEach((key) => {
            assets[key] = new Image();
            assets[key].src = assetSources[key];
            assets[key].onload = () => {
                assetsLoaded++;
                if (assetsLoaded === totalAssets) {
                    callback();
                }
            };
        });
    }

    function initGame() {
        assetsLoaded = true;
        background = { x: 0, speed: 2, img: assets.sky };
        player = { x: 100, y: 200, width: 50, height: 50, dy: 0, img: assets.bird };
        eggs = []; // Initialize eggs array
        bads = []; // Initialize bads array
        // Populate eggs and bads arrays with objects
        // Each object should have properties x, y, width, height, and img (pointing to the corresponding image in the assets object)

        // Start the game loop
        gameLoop();
    }

    function gameLoop() {
        if (!gameRunning) return;

        requestAnimationFrame(gameLoop);
        updateGame();
        renderGame();
    }

    function updateGame() {
        // Update game objects
        // This includes moving the background, applying gravity to the player,
        // checking for collisions, and updating scores and lives as necessary
    }

    function renderGame() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the scrolling background
        ctx.drawImage(assets.sky, background.x, 0, canvas.width, canvas.height);
        ctx.drawImage(assets.sky, background.x + canvas.width, 0, canvas.width, canvas.height);

        // Draw the player
        ctx.drawImage(player.img, player.x, player.y, player.width, player.height);

        // Draw eggs and bads
        eggs.forEach(egg => {
            ctx.drawImage(egg.img, egg.x, egg.y, egg.width, egg.height);
        });
        bads.forEach(bad => {
            ctx.drawImage(bad.img, bad.x, bad.y, bad.width, bad.height);
        });

        // Update and display scores and lives
        messageDiv.innerText = `Score: ${score} | Lives: ${lives}`;
    }

    startButton.addEventListener('click', () => {
        if (!assetsLoaded) {
            loadAssets(initGame);
        }
        welcomeScreen.style.display = 'none';
        canvas.style.display = 'block';
        gameRunning = true;
    });
});
