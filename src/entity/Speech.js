import Phaser from 'phaser'

export default class Speech extends Phaser.GameObjects.Container {
    constructor(scene, x, y, message) {
        super(scene, x, y);
        scene.add.existing(this);

        this.bubble = scene.add.image(0, 0, 'bubble');
        this.bubble.setScale(0.1);
        this.add(this.bubble);

        this.messageText = scene.add.text(-30, -30, message, { fontSize: '14px', fill: "#000", fontFamily: 'Georgia,serif' });
        this.add(this.messageText);

        this.setVisible(false);
    }

    setMessage(message) {
        this.messageText.setText(message);
    }

    show() {
        this.setVisible(true);
    }

    hide() {
        this.setVisible(false);
    }

    update(x, y) {
        this.x = x + 90;
        this.y = y - 90;
    }
}

