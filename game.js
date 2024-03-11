document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;

    let gameRunning = false;
    let backgroundX = 0;
    const backgroundSpeed = 1;
    const images = {};

    // Preload images
    function preloadImages(callback) {
        const imageSources = {
            sky: 'https://github.com/mauriceconti/Joust/raw/main/sky.png',
            player: 'https://github.com/mauriceconti/Joust/raw/main/bird.png',
            egg1: 'https://github.com/mauriceconti/Joust/raw/main/egg.png', 
            egg2: 'https://github.com/mauriceconti/Joust/raw/main/egg2.png',
            egg3: 'https://github.com/mauriceconti/Joust/raw/main/egg3.png',
            startButton: 'https://github.com/mauriceconti/Joust/raw/main/startButton.png',// Example path, adjust as necessary
            bad: 'https://github.com/mauriceconti/Joust/raw/main/bad.png' // Example path, adjust as necessary
            // Add paths for egg2, egg3, etc.
        };

        let loadedImagesCount = 0;
        const numOfImages = Object.keys(imageSources).length;

        for (let key in imageSources) {
            images[key] = new Image();
            images[key].onload = () => {
                if (++loadedImagesCount >= numOfImages) {
                    callback(); // All images loaded
                }
            };
            images[key].src = imageSources[key];
        }
    }

    let player = { x: 100, y: 200, width: 40, height: 40, dy: 0 };
    const gravity = 0.25;
    const lift = -6;

    function startGame() {
        document.getElementById('welcomeScreen').style.display = 'none';
        canvas.style.display = 'block';
        gameRunning = true;
        gameLoop();
    }

    function gameLoop() {
        if (!gameRunning) return;
        requestAnimationFrame(gameLoop);

        // Scrolling background
        backgroundX -= backgroundSpeed;
        if (backgroundX <= -canvas.width) {
            backgroundX = 0;
        }
        ctx.drawImage(images['sky'], backgroundX, 0, canvas.width, canvas.height);
        ctx.drawImage(images['sky'], backgroundX + canvas.width, 0, canvas.width, canvas.height);

        // Update and draw player
        player.dy += gravity;
        player.y += player.dy;
        if (player.y + player.height > canvas.height) {
            player.y = canvas.height - player.height;
            player.dy = 0;
        }
        ctx.drawImage(images['player'], player.x, player.y, player.width, player.height);

        // Placeholder for items and enemies handling
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
            player.dy = lift;
        }
    });

    document.getElementById('startButton').addEventListener('click', () => {
        preloadImages(startGame); // Preload images then start the game
    });
});
