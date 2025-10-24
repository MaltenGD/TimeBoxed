import Tali from '../../tali/tali.js';

/**
 * @class TaliBeginScene
 * The scene for the initial rolls for Tali.
 */
export class TaliBeginScene extends Phaser.Scene {
    taliGame;
    width;
    height;
    
    boardImg;
    diceImages = [];

    constructor() {
        super('TaliBeginScene');
    }

    preload() {
        let {width, height} = this.sys.game.canvas;
        this.width = width;
        this.height = height;
        
        this.loadImages();
    }
}