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
    let playing = false;

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

    function startGame() {
        document.getElementById('startScreen').style.display = 'none';
        playing = true;
        requestAnimationFrame(gameLoop);
    }

    function gameLoop(timestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        player.update();
        player.draw();

        // Egg and Bad Guy logic
        handleObjects(eggs, eggImage, 2000, lastEggTime, timestamp, () => score += 100);
        handleObjects(badGuys, badImage, 5000, lastBadTime, timestamp, () => {
            lives--;
            if (lives === 0) {
                alert("Game Over!!");
                document.location.reload();
            }
        });

        // Speed increase
        if (score % 1000 === 0 && score !== 0) {
            gameSpeed += 0.1;
        }

        drawScoreAndLives();
        if (playing) requestAnimationFrame(gameLoop);
    }

    function handleObjects(objects, image, frequency, lastTime, currentTime, collisionEffect) {
        if (currentTime - lastTime > frequency / gameSpeed) {
            objects.push({
                x: canvas.width,
                y: Math.random() * (canvas.height - 50),
                width: 50,
                height: 50
            });
            lastTime = currentTime;
        }
        objects.forEach((obj, index) => {
            obj.x -= 3 * gameSpeed;
            if (obj.x + obj.width < 0) {
                objects.splice(index, 1);
            }
            ctx.drawImage(image, obj.x, obj.y, obj.width, obj.height);
            // Collision detection
            if (obj.x < player.x + player.width && obj.x + obj.width > player.x &&
                obj.y < player.y + player.height && obj.y + obj.height > player.y) {
                objects.splice(index, 1);
                collisionEffect();
            }
        });
    }

    function drawBackground() {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }

    function drawScoreAndLives() {
        ctx.font = "16px Futura";
        ctx.fillStyle = "white";
        ctx.fillText(`Score: ${score} | Lives: ${lives}`, 10, 20);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === "ArrowUp") player.dy = lift;
    });

    canvas.addEventListener('touchstart', () => {
        player.dy = lift;
    });

    window.startGame = startGame; // Make startGame available globally
});
