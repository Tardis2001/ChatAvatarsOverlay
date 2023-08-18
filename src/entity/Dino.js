import Phaser from 'phaser'

export default class Dino extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'dino');
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.setScale(2);
        this.setBounce(0.4);
        this.setCollideWorldBounds(true);
        this.anims.play('run');
    }

    jump() {
        this.setVelocityY(-300);
    }

    update(info) {
        this.setVelocityX(50 * info.direction);

        if (info.direction === 1 && this.x >= info.endX) {
            info.direction = -1;
            this.flipX = true;
        } else if (info.direction === -1 && this.x <= info.startX) {
            info.direction = 1;
            this.flipX = false;
        }
    }
}




