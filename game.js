document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let score = 0;
    let lives = 3;
    let gameSpeed = 1;
    const eggs = [];
    const badGuys = [];
    let lastEggTime = Date.now();
    let lastBadTime = Date.now();

    const birdImage = new Image();
    const eggImage = new Image();
    const badImage = new Image();
    const backgroundImage = new Image();

    birdImage.src = 'https://mauriceconti.github.io/Joust/bird.png';
    eggImage.src = 'https://mauriceconti.github.io/Joust/egg.png';
    badImage.src = 'https://mauriceconti.github.io/Joust/bad.png';
    backgroundImage.src = 'https://mauriceconti.github.io/Joust/sky.png';

    const player = { x: 100, y: canvas.height / 2, dy: 0, width: 60, height: 45 };
    const gravity = 0.25;
    const lift = -5;

    window.addEventListener('resize', resizeCanvas);
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === "ArrowUp") player.dy = lift;
    });

    canvas.addEventListener('touchstart', () => {
        player.dy = lift;
    });

    function startGame() {
        document.getElementById('startScreen').style.display = 'none';
        requestAnimationFrame(gameLoop);
    }

    function gameLoop(timestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        updatePlayer();
        handleEggs();
        handleBadGuys();
        drawScoreAndLives();

        if (score % 1000 === 0 && score !== 0) {
            gameSpeed += 0.02;
        }

        requestAnimationFrame(gameLoop);
    }

    function updatePlayer() {
        player.dy += gravity;
        player.y += player.dy;
        if (player.y > canvas.height - player.height) {
            player.y = canvas.height - player.height;
            player.dy = 0;
        } else if (player.y < 0) {
            player.y = 0;
            player.dy = 0;
        }
        ctx.drawImage(birdImage, player.x, player.y, player.width, player.height);
    }

    function handleEggs() {
        if (Date.now() - lastEggTime > 2000 / gameSpeed && eggs.length < 12) {
            eggs.push({ x: canvas.width, y: Math.random() * (canvas.height - 50), width: 50, height: 50 });
            lastEggTime = Date.now();
        }
        eggs.forEach((egg, index) => {
            egg.x -= 2 * gameSpeed;
            if (egg.x + egg.width < 0) {
                eggs.splice(index, 1);
            }
            ctx.drawImage(eggImage, egg.x, egg.y, egg.width, egg.height);
            checkCollision(egg, index);
        });
    }

    function handleBadGuys() {
        if (Date.now() - lastBadTime > 8000 / gameSpeed && badGuys.length < eggs.length / 4) {
            badGuys.push({ x: canvas.width, y: Math.random() * (canvas.height - 60), width: 60, height: 60 });
            lastBadTime = Date.now();
        }
        badGuys.forEach((bad, index) => {
            bad.x -= 3 * gameSpeed;
            if (bad.x + bad.width < 0) {
                badGuys.splice(index, 1);
            }
            ctx.drawImage(badImage, bad.x, bad.y, bad.width, bad.height);
            checkCollision(bad, index);
        });
    }

    function checkCollision(object, index) {
        if (player.x < object.x + object.width && player.x + player.width > object.x &&
            player.y < object.y + object.height && player.y + player.height > object.y) {
            if (eggs.includes(object)) {
                score += 100;
                eggs.splice(index, 1);
            } else if (badGuys.includes(object)) {
                lives -= 1;
                badGuys.splice(index, 1);
                if (lives === 0) {
                    gameOver();
                } else {
                    loseLife();
                }
            }
        }
    }

    function loseLife() {
        // Flash the screen red
        flashScreen("red", 300);

        // Reset player position
        player.y = canvas.height / 2;

        // Restart the game loop
        requestAnimationFrame(gameLoop);
    }

    function gameOver() {
        // Flash the screen red for 3 seconds
        flashScreen("red", 3000);

        // Show "Game Over" message after 3 seconds
        setTimeout(() => {
            alert("Game Over!!");
            document.location.reload();
        }, 3000);
    }

    function flashScreen(color, duration) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, duration);
    }

    function drawBackground() {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }

    function drawScoreAndLives() {
        ctx.font = "16px Futura";
        ctx.fillStyle = "white";
        ctx.fillText(`Score: ${score} | Lives: ${lives}`, 10, 20);
    }

    window.startGame = startGame;
});
