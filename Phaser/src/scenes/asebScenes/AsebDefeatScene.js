export class AsebDefeatScene extends Phaser.Scene {
    constructor() {
        super('AsebDefeatScene');
    }

    preload() {
        
    }

    create() {
        let {width, height } = this.sys.game.canvas;
        let text = this.add.text(width/2, height/2, "DEFEAT! ENEMY WINS!", {fontSize: 64}).setOrigin(0.5);
    }
}