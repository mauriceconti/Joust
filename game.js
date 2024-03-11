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

    const player = { x: 100, y: canvas.height / 2, dy: 0, width: 60, height: 45, update: function() {
        this.dy += gravity;
        this.y += this.dy;
        if (this.y > canvas.height - this.height || this.y < 0) {
            this.dy = 0;
            this.y = canvas.height / 2;
        }
    }, draw: function() {
        ctx.drawImage(birdImage, this.x, this.y, this.width, this.height);
    }};
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
        gameLoop();
    }

    function gameLoop(timestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        player.update();
        player.draw();

        handleEggs();
        handleBadGuys();
        drawScoreAndLives();

        if (score % 1000 === 0 && score !== 0) {
            gameSpeed += 0.03;
            adjustGameDifficulty();
        }

        requestAnimationFrame(gameLoop);
    }

    function handleEggs() {
        if (Date.now() - lastEggTime > 2000 / gameSpeed && eggs.length < 12) {
            createEgg();
            lastEggTime = Date.now();
        }
        updateAndDrawObjects(eggs, eggImage);
    }

    function handleBadGuys() {
        if (Date.now() - lastBadTime > 8000 / gameSpeed && badGuys.length < eggs.length / 4) {
            createBadGuy();
            lastBadTime = Date.now();
        }
        updateAndDrawObjects(badGuys, badImage);
    }

    function createEgg() {
        // Logic to ensure no vertical overlap and limit on-screen eggs
        let positionY;
        do {
            positionY = Math.random() * (canvas.height - 50);
        } while (eggs.some(egg => Math.abs(egg.y - positionY) < eggImage.height));
        
        eggs.push({ x: canvas.width, y: positionY, width: 50, height: 50 });
    }

    function createBadGuy() {
        badGuys.push({ x: canvas.width, y: Math.random() * (canvas.height - 60), width: 60, height: 60 });
    }

    function updateAndDrawObjects(objects, image) {
        objects.forEach((object, index) => {
            object.x -= 2 * gameSpeed;
            if (object.x + object.width < 0) {
                objects.splice(index, 1);
            }
            ctx.drawImage(image, object.x, object.y, object.width, object.height);
            checkCollision(object, index);
        });
    }

    function checkCollision(object, index) {
        if (player.x < object.x + object.width && player.x + player.width > object.x &&
            player.y < object.y + object.height && player.y + player.height > object.y) {
            // Handle collision based on object type
            handleCollisionWithPlayer(object, index);
        }
    }

    function handleCollisionWithPlayer(object, index) {
        if (eggs.includes(object)) {
            score += 100;
            eggs.splice(index, 1);
        } else if (badGuys.includes(object)) {
            lives -= 1;
            badGuys.splice(index, 1);
            if (lives === 0) {
                alert("Game Over!!");
                document.location.reload();
            }
        }
    }

    function drawBackground() {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }

    function drawScoreAndLives() {
        ctx.font = "16px Futura";
        ctx.fillStyle = "white";
        ctx.fillText(`Score: ${score} | Lives: ${lives}`, 10, 20);
    }

    function adjustGameDifficulty() {
        // Adjust difficulty, if needed, based on score or other game events
    }

    window.startGame = startGame;
});
