import GameScene from "./scene/GameScene";
const config = {
    type: Phaser.WEBGL,
    scale: {
      
      // mode: Phaser.Scale.FIT,
      parent: 'game',
      // autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 800,
      height: 600

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
    scene:[GameScene]
}

export default config;