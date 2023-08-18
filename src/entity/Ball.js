import Phaser from 'phaser'

export default class Ball extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y,dino) {
    super(scene, x, y, 'ball');
    scene.add.existing(this);
    scene.physics.world.enable(this);
    
    this.setCollideWorldBounds(true);
    this.setScale(0.04);
    this.setBounce(1);
    // this.scene.physics.add.collider(this,dino)
    this.scene.physics.add.collider(dino,this,() => {
        const dinoDirection = dino.flipX ? 1 : -1;
        this.setVelocityX(-200 * dinoDirection);
      })
    this.scene.physics.add.collider(this,this.scene.ground)
  }

}
  