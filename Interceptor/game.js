var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 800,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {y: 0},
                debug: false
            }
        },
        scene: [Scene1, Scene2]
        
    };
    //Controls
    var keys;
    var cursors;
    var isDown = false;
    var mouseX = 0;
    var mouseY = 0;

    //HUD Elements
    var score = 0;
    var scoreText;
    var text;
    var gameOverText;

    //Player
    var player;
    var lastFired = 0;
    var fireRate = 500;
    var moving = false;
    var gameOver = false;

    //Enemies
    var pickup;
    var pickupValue = 100;
    var bullets;
    var targets;
    var targetSpeed = 0.15;
    var targetValue = 10;
    var targetsDestroyed = 0;
    var largeAsteroids;
    var numLargeAsteroids = 0;
    var largeAsteroidFactor = 100;
   

    var game = new Phaser.Game(config);
   
    
    
