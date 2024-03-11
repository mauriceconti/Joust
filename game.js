class WelcomeScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'WelcomeScreen' });
    }

    preload() {
        this.load.image('startButton', 'https://github.com/mauriceconti/Joust/raw/main/startButton.png'); // Placeholder, replace with actual path
    }

    create() {
        const welcomeText = "Welcome to Yoga Joust!\n\nA game made by Maurice and a GPT\n\nGobble up the Yolos. Don’t touch the couches!\n\nGood Luck!";
        this.add.text(100, 100, welcomeText, { fontSize: '20px', fill: '#fff', align: 'center' });

        const startButton = this.add.image(400, 300, 'startButton').setInteractive();
        startButton.on('pointerdown', () => {
            this.scene.start('MainGame');
        });
    }
}

class MainGame extends Phaser.Scene {
    constructor() {
        super({ key: 'MainGame' });
    }

    preload() {
        this.load.image('sky', 'https://github.com/mauriceconti/Joust/raw/main/sky.png');
        this.load.image('bird', 'https://github.com/mauriceconti/Joust/raw/main/bird.png');
        this.load.image('egg1', 'https://github.com/mauriceconti/Joust/raw/main/egg.png'); // Assume egg.png is egg1
        this.load.image('egg2', 'YOUR_PATH_FOR_EGG2'); // Placeholder, replace with actual path
        this.load.image('egg3', 'YOUR_PATH_FOR_EGG3'); // Placeholder, replace with actual path
        this.load.image('bad', 'https://github.com/mauriceconti/Joust/raw/main/bad.png');
    }

    create() {
        // Game setup code here (similar to previous `create` function)
        // Background
        this.add.image(400, 300, 'sky');

        // Player
        player = this.physics.add.sprite(100, 450, 'bird');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        // Score & Lives
        scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
        livesText = this.add.text(650, 16, 'Lives: 3', { fontSize: '32px', fill: '#000' });

        // Controls
        cursors = this.input.keyboard.createCursorKeys();

        // Generate eggs with specified ratios
        this.generateEggs();

        // Generate bads
        bads = this.physics.add.group({
            key: 'bad',
            repeat: 2,
            setXY: { x: 12, y: 0, stepX: 150 }
        });

        // Colliders and Overlaps
        this.physics.add.collider(player, eggs, collectEgg, null, this);
        this.physics.add.collider(player, bads, hitBad, null, this);
    }

    update() {
        // Update logic here (similar to previous `update` function)
        if (gameOver) {
            this.scene.start('WelcomeScreen');
        }
    }

    generateEggs() {
        eggs = this.physics.add.group();
        const totalEggs = 20; // Total eggs to spawn
        for (let i = 0; i < totalEggs; i++) {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(0, 600);
            let eggType = 'egg1'; // Default egg type
            const rand = Math.random();
            if (rand < 0.1) {
                eggType = 'egg3'; // 10% chance
            } else if (rand < 0.3) {
                eggType = 'egg2'; // 20% chance
            }
            eggs.create(x, y, eggType);
        }
    }
}

// Game configuration with scenes
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [WelcomeScreen, MainGame]
};

const game = new Phaser.Game(config);

function collectEgg(player, egg) {
    egg.disableBody(true, true);
    let scoreIncrement = 100;
    if (egg.texture.key === 'egg2') {
        scoreIncrement = 200; // Assuming egg2 is worth 200 points
    } else if (egg.texture.key === 'egg3') {
        scoreIncrement = 500;
    }
    score += scoreIncrement;
    scoreText.setText('Score: ' + score);
}

function hitBad(player, bad) {
    bad.disableBody(true, true);
    lives -= 1;
    livesText.setText('Lives: ' + lives);

    if (lives <= 0) {
        gameOver = true;
        // Add game over logic or message here
    }
}
