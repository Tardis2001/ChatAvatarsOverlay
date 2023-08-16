import Phaser from 'phaser'
const tmi = require('tmi.js');

let params = new URLSearchParams(location.search);

const options = {
    connection:{
        secure:true,
        reconnect:true,
    },
    channels: [params.get('name')],
};
const client = new tmi.Client(options);

function preload() {
    this.load.spritesheet('dino', 'assets/DinoSprite.png',{frameWidth:24,frameHeight:24});
    this.load.image('ground','assets/map2.png')
    this.load.image('ball','assets/ball.png')
    this.load.image('bubble', 'assets/balao.png');

}

let bubbleMessages = {}
let usernames = {}
let bubbleContainer = {}
let spriteInfo = {};
let sprites  = []


function create(){
  client.connect();

  this.anims.create({key: 'run',frames: this.anims.generateFrameNumbers('dino', { start: 1, end: 4 }),frameRate: 10,repeat: -1});
 
  const ground = this.physics.add.staticSprite(400,560, 'ground'); // Substitua 'ground' pela textura do chão
  ground.setScale(1)
  client.on('message', (channel, userstate, message, self) => {
    
    if(typeof message != "undefined"){
        const username = userstate.username;
        if (!sprites[username] ) {
                      
              const x = Phaser.Math.Between(0, 800)
              const y = Phaser.Math.Between(0, 200)
              const sprite = this.physics.add.sprite(x, y, 'dino')
              sprite.setScale(2)
              sprite.setBounce(0.4)
              sprite.setCollideWorldBounds(true)
              sprite.anims.play('run')
              this.physics.add.collider(sprite, ground) // Configura a colisão entre sprite e chão
        
              sprites[username] = sprite;
              sprites.forEach(sprite => {
                  this.physics.world.enable(sprite);
              });
              usernames[username] = this.add.text(sprites[username].x - 20,sprites[username].y - 40,username,{fontSize:'10px',fill:'#FFF',fontFamily:'Georgia,serif'})
        }
        if (sprites[username]) {
          
          spriteInfo[username] = {
            startX: 50,
            endX:  750,
            direction: 1, // Inicia a direção para a direita
          }
          if (!bubbleMessages[username]) {
            bubbleContainer[username] = this.add.container(sprites[username].x, sprites[username].y);
            const bubble = this.add.image(0,0,'bubble');
            bubble.setScale(0.1)
            bubbleContainer[username].add(bubble);
            
            bubbleMessages[username] = this.add.text( -30, -30 ,message, { fontSize:'14px', fill:"#000", fontFamily:'Georgia,serif' });
            bubbleContainer[username].add(bubbleMessages[username])
                 // Mostrar o balão e a mensagem
          bubbleContainer[username].setVisible(true);

          // Configurar um temporizador para ocultar o balão após um período de tempo
          this.time.delayedCall(4000, () => {
              bubbleContainer[username].setVisible(false);
          });
            } else {
              
            bubbleContainer[username].x = sprites[username].x + 90;
            bubbleContainer[username].y = sprites[username].y - 90;
            const maxLength = 10; // Defina o número máximo de caracteres por linha
            let formattedMessage = '';
            for (let i = 0; i < message.length; i += maxLength) {
                formattedMessage += message.substr(i, maxLength) + '\n';
            }
        
            bubbleMessages[username].setText(formattedMessage);
            bubbleMessages[username].x = -30;
            bubbleMessages[username].y = -30;
            bubbleContainer[username].setVisible(true);

            // Configurar um temporizador para ocultar o balão após um período de tempo
            this.time.delayedCall(4000, () => {
                bubbleContainer[username].setVisible(false);
            });
      }
    }
      if (message === "!jump" && sprites[username]) {
        // Aplicar uma força vertical para fazer o dinossauro pular
        sprites[username].setVelocityY(-300); // Ajuste a força conforme necessário
      }
      if (message === "!ball" && sprites[username]) {
                 
        const x = Phaser.Math.Between(0, 800)
        const y = Phaser.Math.Between(0, 200)
        const ball = this.physics.add.sprite(x, y, 'ball');
        ball.setCollideWorldBounds(true);
        ball.setScale(0.04)
        ball.setBounce(1)
        this.physics.add.collider(ball, ground)
        for (const spriteUsername in sprites) {
          const dino = sprites[spriteUsername];
          this.physics.add.collider(dino, ball, () => {
              // Ação a ser executada quando a bola colide com um dinossauro   
              const dinoDirection = dino.flipX ? 1 : -1;
            // Aplica uma velocidade à bola no sentido oposto do dino
              ball.setVelocityX(-200 * dinoDirection); // Ajuste a velocidade conforme necessário
          });
      }
      }
    }
  });
    
}
let startX = 100; // Ponto inicial X
let endX = 700;  // Ponto final X

function update(){

  for (const username in sprites) {
    const sprite = sprites[username];
    const info = spriteInfo[username];

      sprite.setVelocityX(50 * info.direction);

      if (info.direction === 1 && sprite.x >= info.endX) {
          info.direction = -1;
          sprite.flipX = true;
      } else if (info.direction === -1 && sprite.x <= info.startX) {
          info.direction = 1;
          sprite.flipX = false;
      }

        if (sprite) {
            bubbleContainer[username].x = sprite.x + 90;
            bubbleContainer[username].y = sprite.y - 90;
            
            usernames[username].x = sprite.x - 20;
            usernames[username].y = sprite.y - 40;

        }
    }
    
this.children.bringToTop(bubbleContainer);
}


const config = {
    type: Phaser.AUTO,
    scale: {
      parent: 'game',
      width:2000,
      height:  2000
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y : 200},
        debug:false
      }
    },
    transparent: true
    ,
    scene: {
      preload: preload,
      create: create,
      update : update
    }
  }
  

const game = new Phaser.Game(config);
