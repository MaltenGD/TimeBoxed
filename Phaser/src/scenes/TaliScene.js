/**
 * @class TaliScene
 * The scene for the Tali game (Rome).
 */
export class TaliScene extends Phaser.Scene {
    constructor() {
        super('TaliScene');
    }

    preload() {
        
    }

    create() {
        let {width, height } = this.sys.game.canvas;
        let text = this.add.text(width/2, height/2, "Tali Scene", {fontSize: 64}).setOrigin(0.5);
    }
}