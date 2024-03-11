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
    let lastEggTime = 0;
    let lastBadTime = 0;

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

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        updatePlayer();
        handleEggs();
        handleBadGuys();
        drawScoreAndLives();
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

    function canSpawnEgg() {
        const eggHeight = 50; // Adjust based on your egg image
        return eggs.filter(egg => egg.x > canvas.width - egg.width).length < 1 &&
               eggs.length < 12;
    }

    function handleEggs() {
        if (Date.now() - lastEggTime > 2000 / gameSpeed && canSpawnEgg()) {
            eggs.push({ x: canvas.width, y: Math.random() * (canvas.height - eggHeight), width: 50, height: 50 });
            lastEggTime = Date.now();
        }
        eggs.forEach((egg, index) => {
            egg.x -= 2 * gameSpeed;
            if (egg.x + egg.width < 0) {
                eggs.splice(index, 1);
            }
            ctx.drawImage(eggImage, egg.x, egg.y, egg.width, egg.height);
        });
    }

    function canSpawnBadGuy() {
        return badGuys.length < eggs.length / 4;
    }

    function handleBadGuys() {
        if (Date.now() - lastBadTime > 5000 / gameSpeed && canSpawnBadGuy()) {
            badGuys.push({ x: canvas.width, y: Math.random() * (canvas.height - badHeight), width: 60, height: 60 });
            lastBadTime = Date.now();
        }
        badGuys.forEach((bad, index) => {
            bad.x -= 3 * gameSpeed;
            if (bad.x + bad.width < 0) {
                badGuys.splice(index, 1);
            }
            ctx.drawImage(badImage, bad.x, bad.y, bad.width, bad.height);
        });
    }

    function drawBackground() {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }

    function drawScoreAndLives() {
        ctx.font = "20px Futura";
        ctx.fillStyle = "white";
        ctx.fillText(`Score: ${score} Lives: ${lives}`, 10, 30);
    }

    window.startGame = startGame; // Make the startGame function globally accessible
});
