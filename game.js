document.addEventListener('DOMContentLoaded', () => {
    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var score = 0;
    var lives = 3;
    var gameSpeed = 1;

    var birdImage = new Image();
    var eggImage = new Image();
    var badImage = new Image();
    var backgroundImage = new Image();

    birdImage.src = 'path/to/bird.png'; // Update with the correct path
    eggImage.src = 'path/to/egg.png'; // Update with the correct path
    badImage.src = 'path/to/bad.png'; // Update with the correct path
    backgroundImage.src = 'path/to/sky.png'; // Update with the correct path

    var player = { x: 100, y: canvas.height / 2, dy: 0, width: 60, height: 45 };
    var gravity = 0.25;
    var lift = -5;
    var eggs = [];
    var badGuys = [];
    var eggFrequency = 2000;
    var badFrequency = 5000;
    var lastEggTime = 0;
    var lastBadTime = 0;

    var scrollSpeed = 0.5;
    var backgroundX = 0;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        player.y = canvas.height / 2;
    }
    window.addEventListener('resize', resizeCanvas);

    function drawBackground() {
        backgroundX -= scrollSpeed * gameSpeed;
        if (backgroundX <= -canvas.width) { backgroundX = 0; }
        ctx.drawImage(backgroundImage, backgroundX, 0, canvas.width, canvas.height);
        ctx.drawImage(backgroundImage, backgroundX + canvas.width, 0, canvas.width, canvas.height);
    }

    function drawPlayer() {
        ctx.drawImage(birdImage, player.x, player.y, player.width, player.height);
    }

    function handleInput() {
        canvas.addEventListener('touchstart', () => { player.dy = lift; });
        document.addEventListener('keydown', event => {
            if (event.key === "ArrowUp") { player.dy = lift; }
        });
    }

    function createObject(objects, image, frequency, lastTime, width, height) {
        if (Date.now() - lastTime > frequency / gameSpeed) {
            var object = { x: canvas.width, y: Math.random() * (canvas.height - height), width: width, height: height };
            objects.push(object);
            return Date.now();
        }
        return lastTime;
    }

    function updateObjects(objects) {
        objects.forEach((object, index) => {
            object.x -= 2 * gameSpeed;
            if (object.x + object.width < 0) {
                objects.splice(index, 1);
            }
        });
    }

    function drawObjects(objects, image) {
        objects.forEach(object => {
            ctx.drawImage(image, object.x, object.y, object.width, object.height);
        });
    }

    function checkCollisions(objects) {
        return objects.some((object, index) => {
            if (player.x < object.x + object.width && player.x + player.width > object.x &&
                player.y < object.y + object.height && player.y + player.height > object.y) {
                objects.splice(index, 1);
                return true;
            }
            return false;
        });
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
            if (score % 1000 === 0) {
                gameSpeed += 0.1;
            }
        }
    }

    function drawScoreAndLives() {
        ctx.font = "20px Futura";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(`Score: ${score} Lives: ${lives}`, 10, 30);
    }

    function startGame() {
        document.getElementById('startScreen').style.display = 'none';
        lastEggTime = Date.now();
        lastBadTime = Date.now();
        function gameLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBackground();
            lastEggTime = createObject(eggs, eggImage, eggFrequency, lastEggTime, 30, 40);
            lastBadTime = createObject(badGuys, badImage, badFrequency, lastBadTime, 50, 60);
            updateObjects(eggs);
            updateObjects(badGuys);
            drawObjects(eggs, eggImage);
            drawObjects(badGuys, badImage);
            drawPlayer();
            updateGame();
            drawScoreAndLives();
            player.dy += gravity;
            player.y += player.dy;
            requestAnimationFrame(gameLoop);
        }
        gameLoop();
    }

    handleInput();
});
