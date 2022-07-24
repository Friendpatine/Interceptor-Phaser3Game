class Effect extends Phaser.GameObjects.Sprite{
  constructor(scene,x,y){
    super(scene, x, y, "effect");
    scene.add.existing(this);
    this.play("effectEffect");
  }
}