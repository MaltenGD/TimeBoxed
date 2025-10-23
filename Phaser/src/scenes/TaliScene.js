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
    textBox;
    playerTurn = false;

    currentRoll = [0, 0, 0, 0];
    
    boardImg;
    diceImages = [];

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
        this.taliGame = new Tali();
        
        this.createButtons();
        this.addImages();
        this.addText();
        this.addEventListeners();

        this.startTaliGame();
    }

    /**
     * @function 
     * Starts the Tali game.
     */
    startTaliGame() {
        this.taliGame.startGame();
        this.time.addEvent(({
            delay: 2000,
            callback: () => this.nextTurn(),
            loop: false
        }))
    }

    firstRolls() {
        this.taliGame.enemyTurn();
    }

    /**
     * Creates and places all the buttons for the scene.
     */
    createButtons() {
        this.rollBtn = this.add.text(this.width/2, this.height/2, 'Roll!', { fontSize: 64, fill: '#000', backgroundColor: '#fff'}).setOrigin(0.5, 1).setAlpha(0)
        .setInteractive()
        .on('pointerover', () => this.rollBtn.setStyle({fill: 'rgba(116, 8, 9, 1)'}))
        .on('pointerdown', () => this.taliGame.rollDice())
        .on('pointerout', () => this.rollBtn.setStyle({fill: '#000'}));

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
        this.boardImg = this.add.image(this.width/2, this.height/2, 'board').setOrigin(0.5).setScale(0.6);
    }

    /**
     * Adds all the text to the scene.
     */
    addText() {
        this.enemyScore = this.add.text(this.width - 20, 20, 'Score: ' + this.taliGame.enemyScore).setOrigin(1, 0);
        this.playerScore = this.add.text(20, this.height - 20, 'My Score: ' + this.taliGame.playerScore).setOrigin(0, 1);
        this.textBox = this.add.text(this.width/2, this.height/3, 'Roll to decide who begins!', { fontSize: 64, fill: '#000'}).setOrigin(0.5);
    }

    /**
     * Loads all the images.
     */
    loadImages() {
        this.load.image('board', 'Phaser/assets/tali/temporary_board.png');
        for (let i = 0; i < Tali.NUMBER_OF_DICE; i++) { 
            this.load.image('dice' + i, 'Phaser/assets/tali/temporary_dice' + i + '.png');
        }
    }

    addEventListeners() {
        this.taliGame.emitter.on('playerTurnStart', () => this.playerTurn());
        this.taliGame.emitter.on('enemyTurnStart', () => this.enemyTurn());
        
        this.events.on('turnEnd', ()=>this.nextTurn());

        this.taliGame.emitter.on('diceRolled', (arr) => {this.rollDice(arr)});
    }

    /**
     * Rolls the dice.
     */
    rollDice(arr) {
        this.currentRoll = arr;
        for (let i = 0, j = -this.width/12; i < Tali.NUMBER_OF_DICE; i++, j+=this.width/12) { 
            this.diceImages[i] = this.add.image(this.width/2 - j, this.height/2, 'dice' + this.currentRoll[i]).setOrigin(0, 0.5).setScale(0.3).setAlpha(0);
        }
        this.animateDice();
    }

    /**
     * Animates the dice appearing and disappearing.
     */
    animateDice() {
        this.diceImages.forEach((img) => {
            this.animateDiceIn(img);
        })
    }

    /**
     * Animates the appearance of the dice.
     */
    animateDiceIn(img) {
        this.tweens.add({
            targets: img,
            alpha: 1,
            duration: 1000,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.time.addEvent({
                    delay: 2000, 
                    callback: () => {this.animateDiceOut(img)},
                    loop: false
                });
            }
        })
    }

    /**
     * Animates the disappearance of the dice. 
     */
    animateDiceOut(img) {
        this.tweens.add({
            targets: img,
            alpha: 0,
            duration: 500,
            ease: 'Sine.easeOut',
            onComplete: () => this.events.emit('diceOut')
        })
    }

    nextTurn() {
        if (this.playerTurn) {
            this.playersTurn();
            this.playerTurn = false;
        }
        else {
            this.enemyTurn();
            this.taliGame.rollDice();
            this.playerTurn = true;
        }
        this.events.once('diceOut', () => this.events.emit('turnEnd'));
    }

    playersTurn() {
        this.textBox.setText('Your turn');
        this.rollBtn.setAlpha(1);
    }

    enemyTurn() {
        this.textBox.setText("Mercury's turn");
        this.rollBtn.setAlpha(0);
    }
}