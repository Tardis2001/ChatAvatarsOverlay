import Phaser from 'phaser'
import Dino from './Dino.js'
import Speech from './Speech.js'
import Ball from './Ball.js';
export default class Player {
    constructor(scene, username) {
        this.scene = scene;
        this.dino = new Dino(scene, Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 200));
        this.Speech = new Speech(scene, this.dino.x, this.dino.y, '');
        this.scene.physics.add.collider(this.dino,this.scene.ground)
        this.spriteInfo = {
            startX: 50,
            endX: 750,
            direction: 1
        };
        
        this.username = this.scene.add.text(this.dino.x,this.dino.y - 15, username, { fontSize: '12px', fill: "#FFF", fontFamily: 'Georgia,serif' })
    }

    handleMessage(message) {
        this.Speech.setMessage(message);
        this.Speech.show();
        this.scene.time.delayedCall(4000, () => {
            this.Speech.hide();
        });

        if (message === '!jump') {
            this.dino.jump();
        } else if (message === '!ball') {
            this.throwBall();
        }
    }

    update() {
        this.dino.update(this.spriteInfo);
        this.Speech.update(this.dino.x, this.dino.y);
        this.username.x = this.dino.x - 20
        this.username.y = this.dino.y - 40

    }

    throwBall() {
        const x = Phaser.Math.Between(0, 800);
        const y = Phaser.Math.Between(0, 200);
        const ball = new Ball(this.scene,x,y,this.dino);
    }
}
