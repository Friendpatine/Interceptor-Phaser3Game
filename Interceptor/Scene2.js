class Scene2 extends Phaser.Scene {
  constructor() {
    super("playGame");

  }
  create ()
    {
        
        //Create Skybox
        this.add.image(400, 400, 'space');
        

        //Create Player
        player = this.physics.add.sprite(400,400, 'playerSprite');
        player.setDamping(true);
        player.setDrag(0.98);
        player.setMaxVelocity(200);

        //Sounds
        this.restartSound = this.sound.add("restart");
        this.shootSound = this.sound.add("shoot");
        this.explosionSound = this.sound.add("explode");
        this.pickupSound = this.sound.add("pickupEffect")
        this.boosterStartSound = this.sound.add("boosterStart");
        this.boosterStopSound = this.sound.add("boosterStop");
        this.boosterSound = this.sound.add("booster");
        var boosterConfig = { 
            mute: false,
            volume: 0.5,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }
        this.boosterSound.play(boosterConfig);
        

        //Music
        this.music = this.sound.add("music");
        var musicConfig = { 
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }
        this.music.play(musicConfig);

        //BUllets
        this.bullets = this.physics.add.group(
        {
            key: 'bullet',
            classType: Bullet,
            maxSize: 10,
            runChildUpdate: true
         });

         //Pickup
         this.pickup = this.physics.add.sprite(Phaser.Math.FloatBetween(10, 770),Phaser.Math.FloatBetween(10, 770), 'pickup');
         
         //Large Asteroids
         this.largeAsteroids = this.physics.add.group();
         numLargeAsteroids = 0;

         //Targets (Small Asteroids)
         this.targets = this.physics.add.group({
            key: 'target',
            //classType: Enemy,
            repeat: 11,
            setXY: {x:17, y:780, stepX: 70}
        });
        //Assign random rotation to each asteroid
        this.targets.children.iterate(function (child) {   
               child.angle =  Phaser.Math.FloatBetween(-360, 360);   
        });
       
        //Pointer Location
        this.input.on('pointerdown', function (pointer) {
            isDown = true;
            mouseX = pointer.x;
            mouseY = pointer.y;
         });
        this.input.on('pointermove', function (pointer) {
            mouseX = pointer.x;
            mouseY = pointer.y;
        });
        this.input.on('pointerup', function (pointer) {
            isDown = false;
        });

        
        //Create GameOver Display
        gameOverText = this.physics.add.sprite(400,400,'gameOverScreen');
        gameOverText.disableBody(true, true);
        
        //Create ScoreText
        scoreText = this.add.text(300,16, 'SCORE: 0', {fontSize: '32px', fill: '#fff'});
      
        //Input
        keys = this.input.keyboard.addKeys("W,A,S,D");
        cursors = this.input.keyboard.createCursorKeys();

        //Physics
        //this.physics.add.collider(player, platforms);
        this.physics.add.overlap(this.bullets, this.targets, this.hitTarget, null, this);
        this.physics.add.overlap(player, this.pickup, this.pickupBonus, null, this);
        this.physics.add.overlap(player, this.targets, this.playerHit, null, this);
        this.physics.add.overlap(player, this.largeAsteroids, this.playerHit, null, this);
        this.physics.add.overlap(this.bullets, this.largeAsteroids, this.hitLargeAsteroid, null, this);

       //speed = Phaser.Math.GetSpeed(300, 1);


    }

    //Update Score Function
    updateScore(scoreIncrease){
        score += scoreIncrease;
        scoreText.setText('SCORE: ' + score);
    }

    //Player Hit Function
    playerHit(player, target){
        this.physics.pause();
        player.setTint(0xff0000);
        var explosion = new Explosion(this, player.x, player.y);
        this.explosionSound.play();
        gameOver = true;
    }

    //Player collides with a Pickup
    pickupBonus(player, pickup){
        var effect = new Effect(this, pickup.x, pickup.y);    
        this.pickupSound.play();
        this.updateScore(pickupValue);
        pickup.x = Phaser.Math.FloatBetween(10, 770);  
        pickup.y = Phaser.Math.FloatBetween(10, 770); 
        var effect = new Effect(this, pickup.x, pickup.y);  
     
    }

    //Bullet hit Asteroid 
    hitTarget(bullet, target){
        //1. Disable bullet
        bullet.disableBody();

        //2. Activate explosion effect
        this.explosionSound.play();
        var explosion = new Explosion(this, target.x, target.y);
        
        //3. Update Score
        this.targetsDestroyed += 1;
        this.updateScore(targetValue);
        
        
        //4. Respawn Astroid in new position along y-axis
        target.x = Phaser.Math.FloatBetween(10, 770);  
        target.y = 0;

    }
    
    //Bullet hit Large Asteroid
    hitLargeAsteroid(bullet, largeAsteroid){
        bullet.disableBody();
        this.explosionSound.play();
        var explosion = new Effect(this, bullet.x, bullet.y);
        
    }


    update (time, delta)
    {
       //Check to see if game is active (!=gameOver)
       if(!gameOver){
       //Player Fire Weapon
            var pointer = this.input.activePointer;
            if (pointer.isDown && time > lastFired)
            {
                var bullet = this.bullets.get();

                if (bullet)
                {
                    bullet.fire(mouseX, mouseY);
                    this.shootSound.play();

                    lastFired = time + fireRate;
                }
            }
   
        //Player Look at Pointer
            const angleDeg = Math.atan2(player.y - pointer.worldY, player.x - pointer.worldX) * 180 / Math.PI;
            player.angle = angleDeg-180;
        

        //Player Controls
        
            if (cursors.up.isDown || keys.W.isDown)
            {
                this.physics.velocityFromRotation(player.rotation, 200, player.body.acceleration);
                this.boosterSound.resume();
                player.anims.play('on');
                if(moving == false){
                    this.boosterStartSound.play();
                    moving = true;
                }        
            }
            else
            {
                player.setAcceleration(0);
                this.boosterSound.pause();
                player.anims.play('off');
                if(moving == true){
                    this.boosterStopSound.play();
                    moving = false;
                }
            }
            this.boosterSound.setDetune(player.body.speed * 5);

        }
        else{
            //Initiate GameOver Text and Restart Game Controls
            this.boosterSound.pause();
            gameOverText.enableBody(true, gameOverText.x, gameOverText.y, true, true);
            if (cursors.down.isDown || keys.S.isDown)
            {
                 gameOver = false;
                 this.updateScore(-1*score);
                 this.numLargeAsteroids -= this.numLargeAsteroids;
                 this.restartSound.play();
                 this.music.stop();
                 this.scene.restart();     
             
            }
        }
        
        //Check to see if spawning a Large Asteroid
        this.spawnLargeAsteroid();
        
        //Move Asteroids
        var incX; 
        var incY;
        this.targets.children.iterate(function (child) {
                
                const angleDeg = child.angle  * 180 / Math.PI;
                child.incX = Math.cos(angleDeg);
                child.incY = Math.sin(angleDeg);
                child.x +=  child.incX * (targetSpeed * delta);
                child.y +=  child.incY * (targetSpeed * delta);
        });
        
        //Move Large Asteroids
        this.largeAsteroids.children.iterate(function (child) {
                
                const angleDeg = child.angle  * 180 / Math.PI;
                child.incX = Math.cos(angleDeg);
                child.incY = Math.sin(angleDeg);
                child.x +=  child.incX * (targetSpeed * delta);
                child.y +=  child.incY * (targetSpeed * delta);
        });

        //Enable World-Wrap Effect
        this.physics.world.wrap(player, 32);
        this.physics.world.wrap(this.targets, 32);
        this.physics.world.wrap(this.largeAsteroids, 32);
    }
    
   //Spawn Large Asteroids
   spawnLargeAsteroid(){
        if(score/largeAsteroidFactor>=numLargeAsteroids+1){
            var largeAsteroid = this.largeAsteroids.create(10,16, 'target2');   
            largeAsteroid.angle =  Phaser.Math.FloatBetween(-360, 360);   
            numLargeAsteroids+=1;
        }
   }

}
