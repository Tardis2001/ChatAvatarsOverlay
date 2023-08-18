import Phaser from 'phaser'
import Twitchclient from '../twitch.js';
import Player from '../entity/Player.js'

export default class GameScene extends Phaser.Scene{
    
    constructor(){
        super({key:'GameScene'})
        this.players = []; // Adicione um array para os jogadores
        this.client = new Twitchclient() 
        this.ground;
    }

    preload() {
        this.load.spritesheet('dino', 'assets/DinoSprite.png',{frameWidth:24,frameHeight:24});
        this.load.image('ground','assets/map2.png')
        this.load.image('ball','assets/ball.png')
        this.load.image('bubble', 'assets/balao.png');
    }   

    create(){
        this.createAnimations();
        this.createGround();
        this.client.connect();
        this.client.onMessage(this.handleMessage.bind(this));
    }
    update(){
        for (const username in this.players) {
            this.players[username].update();
        }
    }
    
    handleMessage(channel, userstate, message, self) {
        if (typeof message !== 'undefined') {
            const username = userstate.username;

            if (!this.players[username]) {
                const player = new Player(this, username,this.ground);
                this.players[username] = player;
            }

            this.players[username].handleMessage(message);
        }
    }

    createAnimations() {
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('dino', { start: 1, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
    }

    createGround() {
        this.ground = this.physics.add.staticSprite(400, 560, 'ground');
        this.ground.setScale(1);
    }
}
