import Tali from '../tali/tali.js';
/**
 * @class TaliScene
 * The scene for the Tali game (Rome).
 */
export class TaliScene extends Phaser.Scene {
    taliGame;
    width;
    height;
    
    enemyScore;
    playerScore;
    
    boardImg;
    diceImages;

    constructor() {
        super('TaliScene');
    }

    preload() {
        let {width, height} = this.sys.game.canvas;
        this.width = width;
        this.height = height;
        
        this.loadImages();
    }

    create() {
        let text = this.add.text(this.width/2, this.height/2, "Tali Scene", {fontSize: 64}).setOrigin(0.5);
        this.createButtons();
        this.addImages();
        this.addText();
        this.addDice();
    }

    /**
     * @function 
     * Starts the Tali game.
     */
    startTaliGame() {
        this.taliGame = new Tali();
        this.taliGame.startGame();
    }

    /**
     * Creates and places all the buttons for the scene.
     */
    createButtons() {
        this.rollBtn = this.add.text(this.width - 10, this.height - 10, 'Roll!', { fontSize: 64, fill: '#0f0'}).setOrigin(1)
        .setInteractive()
        .on('pointerover', () => this.rollBtn.setStyle({fill: '#0ff'}))
        .on('pointerdown', () => this.taliGame.rollDice ())
        .on('pointerout', () => this.rollBtn.setStyle({fill: '#0f0'}));

        this.backBtn = this.add.text(0, 0, 'Back', { fontSize: 64, fill: '#fff'})
        .setInteractive()
        .on('pointerover', () => this.backBtn.setStyle({fill: '#0f0'}))
        .on('pointerdown', () => this.scene.start('SelectionMenuScene', { counterTxt: this.counterTxt }))
        .on('pointerout', () => this.backBtn.setStyle({fill: '#fff'}));
    }

    /**
     * Adds all the images to the scene.
     */
    addImages() {
        this.boardImg = this.add.image(this.width/2, this.height/2, 'board').setOrigin(0.5).setScale(0.3);
        
    }

    /**
     * Adds all the text to the scene.
     */
    addText() {
        this.enemyScore = this.add.text(this.width - 20, 20, 'Score: 0').setOrigin(1, 0);
        this.playerScore = this.add.text(20, this.height - 20, 'My Score: 0').setOrigin(0, 1);
    }

    addDice() {

    }

    loadImages() {
        this.load.image('board', 'Phaser/assets/tali/temporary_board.png');
        for (let i = 0; i < Tali.NUMBER_OF_DICE; i++) { 
            this.load.image('board', 'Phaser/assets/tali/temporary_dice0.png');
        }
    }
}