export class AsebVictoryScene extends Phaser.Scene {
    constructor() {
        super('AsebVictoryScene');
    }

    preload() {
        
    }

    create() {
        let {width, height } = this.sys.game.canvas;
        let text = this.add.text(width/2, height/2, "VICTORY! PLAYER WINS!", {fontSize: 64}).setOrigin(0.5);
    }
}