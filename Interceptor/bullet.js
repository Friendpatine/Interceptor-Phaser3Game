 var Bullet = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize:

            function Bullet (scene)
            {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

                this.incX = 0;
                this.incY = 0;
                this.lifespan = 0;

                this.speed = Phaser.Math.GetSpeed(600, 1);
            },

            fire: function (x, y)
            {
                this.setActive(true);
                this.setVisible(true);
                this.setPosition(player.x, player.y);

                var angle = Phaser.Math.Angle.Between(x, y, player.x, player.y);

                this.setRotation(angle);

                this.incX = Math.cos(angle);
                this.incY = Math.sin(angle);

                this.lifespan = 2000;

                
            },

            update: function (time, delta)
            {
                this.lifespan -= delta;

                this.x -= this.incX * (this.speed * delta);
                this.y -= this.incY * (this.speed * delta);

                if (this.lifespan <= 0)
                {
                    this.setActive(false);
                    this.setVisible(false);
                }
            },

            disableBody: function ()
            {
                this.setActive(false);
                this.setVisible(false);
                this.body.stop();
                
            }
    });