document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;

    let player = { x: 100, y: 200, width: 40, height: 40, speed: 5, dy: 0 };
    let gravity = 0.25;
    let lift = -6;
    let eggs = [];
    let bads = [];
    let score = 0;
    let lives = 3;
    let gameRunning = false;
    const eggTypes = [{ type: 'egg1', points: 100 }, { type: 'egg2', points: 200 }, { type: 'egg3', points: 500 }];
    let messageTimeout = null;

    function startGame() {
        document.getElementById('welcomeScreen').style.display = 'none';
        canvas.style.display = 'block';
        gameRunning = true;
        resetGame();
        gameLoop();
    }

    function resetGame() {
        eggs = [];
        bads = [];
        score = 0;
        lives = 3;
        player.y = canvas.height / 2;
        player.dy = 0;
        spawnItems();
    }

    function spawnItems() {
        for (let i = 0; i < 20; i++) {
            let eggType = eggTypes[Math.floor(Math.random() * eggTypes.length)];
            eggs.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                width: 20,
                height: 20,
                points: eggType.points
            });
        }
        for (let i = 0; i < 5; i++) {
            bads.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                width: 30,
                height: 30
            });
        }
    }

    function gameLoop() {
        if (!gameRunning) return;
        requestAnimationFrame(gameLoop);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update player
        player.dy += gravity;
        player.y += player.dy;
        if (player.y + player.height > canvas.height) {
            player.y = canvas.height - player.height;
            player.dy = 0;
        }

        // Draw player
        ctx.fillStyle = 'blue';
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Handle eggs and bads
        handleItems(eggs, 'yellow', (egg) => {
            score += egg.points;
            showMessage(`+${egg.points} points!`);
        });
        handleItems(bads, 'red', () => {
            lives -= 1;
            showMessage('Oh No! You lost a life');
            if (lives <= 0) {
                gameOver();
            }
        });

        // Display score and lives
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, 10, 30);
        ctx.fillText(`Lives: ${lives}`, 10, 60);
    }

    function handleItems(items, color, collisionCallback) {
        for (let i = items.length - 1; i >= 0; i--) {
            const item = items[i];
            ctx.fillStyle = color;
            ctx.fillRect(item.x, item.y, item.width, item.height);
            if (checkCollision(player, item)) {
                collisionCallback(item);
                items.splice(i, 1);
            }
        }
    }

    function checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.height + rect1.y > rect2.y;
    }

    function showMessage(message) {
        clearTimeout(messageTimeout);
        document.getElementById('message').textContent = message;
        messageTimeout = setTimeout(() => {
            document.getElementById('message').textContent = '';
        }, 3000);
    }

    function gameOver() {
        gameRunning = false;
        showMessage('Game Over!! :-(');
        setTimeout(() => {
            document.getElementById('welcomeScreen').style.display = 'block';
            canvas.style.display = 'none';
        }, 3000);
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
            player.dy = lift;
        }
    });

    document.getElementById('startButton').addEventListener('click', startGame);
});
