import Tali from '../tali/tali.js';
/**
 * @class TaliScene
 * The scene for the Tali game (Rome).
 */
export class TaliScene extends Phaser.Scene {
    taliGame;
    width;
    height;

    constructor() {
        super('TaliScene');
    }

    preload() {
        let {width, height} = this.sys.game.canvas;
        this.width = width;
        this.height = height;
    }

    create() {
        let text = this.add.text(this.width/2, this.height/2, "Tali Scene", {fontSize: 64}).setOrigin(0.5);
        this.createButtons();
    }

    /**
     * @function 
     * Starts the Tali game.
     */
    startTaliGame() {
        this.taliGame = new Tali();
        this.taliGame.startGame();
    }

    createButtons() {
        this.rollBtn = this.add.text(this.width / 2, this.height / 2, 'Roll!', { fontSize: 64, fill: '#0f0'}).setOrigin(0.5)
        .setInteractive()
        .on('pointerover', () => this.rollBtn.setStyle({fill: '#0ff'}))
        .on('pointerdown', () => this.taliGame.rollDice ())
        .on('pointerout', () => this.rollBtn.setStyle({fill: '#0f0'}));
    }
}