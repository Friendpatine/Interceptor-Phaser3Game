 class Scene1 extends Phaser.Scene 
 {
  constructor() 
  {
    super("bootGame");
  }
    

    preload ()
    {
    //Load Images
        this.load.image('space', 'assets/SpaceBG.png');
        this.load.image('ship', 'assets/Ship.png');
        this.load.image('bullet', 'assets/bullet.png');
        this.load.image('pickup', 'assets/pickup.png');
        this.load.image('target', 'assets/target4.png');
        this.load.image('target2', 'assets/target2.png');
        this.load.image('gameOverScreen', 'assets/DeathScreen.png');

    //Load Spritesheets
        this.load.spritesheet("explosion", "assets/explosionEffect2.png",{
            frameWidth: 118,
            frameHeight: 80
        });
        this.load.spritesheet("effect", "assets/PickupEffect.png",{
            frameWidth:80,
            frameHeight:80
        });
        this.load.spritesheet("playerSprite", "assets/player.png",{
            frameWidth:27,
            frameHeight:30
        });

    //Load Audio (SFX)
        this.load.audio("restart", ["assets/restart.mp3"]);
        this.load.audio("pickupEffect", ["assets/pickupSound.mp3"]);
        this.load.audio("shoot", ["assets/shoot.mp3"]);
        this.load.audio("booster", ["assets/booster.mp3"]);
        this.load.audio("boosterStart", ["assets/boosterStart.mp3"]);
        this.load.audio("boosterStop", ["assets/boosterStop.mp3"]);
        this.load.audio("explode", ["assets/explode.mp3"]);
        

    //Load Audio (Music)
        this.load.audio("music", ["assets/music.mp3"]);
        
    }

    create() 
    {
        this.add.text(20, 20, "Loading game...");
        this.scene.start("playGame");

    //Create Animations
        this.anims.create({
            key: "off",
            frames: [{key: 'playerSprite', frame: 0}],
            frameRate:20
        });
        this.anims.create({
            key: "on",
            frames: [{key: 'playerSprite', frame: 1}],
            frameRate:20
        });
        this.anims.create({
            key: "explodeEffect",
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
        });
        this.anims.create({
            key: "effectEffect",
            frames: this.anims.generateFrameNumbers("effect"),
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
        });
    }
   
 }

   