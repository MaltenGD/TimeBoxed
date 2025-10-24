import Tali from '../../tali/tali.js';
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
    turnText;
    resultText;

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

    /**
     * Loads all the images.
     */
    loadImages() {
        this.load.image('board', 'Phaser/assets/tali/temporary_board.png');
        for (let i = 0; i < Tali.NUMBER_OF_DICE; i++) { 
            this.load.image('dice' + i, 'Phaser/assets/tali/temporary_dice' + i + '.png');
        }
    }

    create() {
        this.taliGame = new Tali();
        
        this.addImages();
        this.createButtons();
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
        this.firstRolls();
    }

    /**
     * Executes the first rolls.
     */
    firstRolls() {
        let text = this.add.text(this.width/2, this.height/4, 'Roll to decide who begins!', { fontSize: 64, fill: '#000'}).setOrigin(0.5);
        this.rollBtn.once('pointerdown', () => {this.gameStarted();});
    }

    /**
     * Starts the game with the first rolls.
     */
    gameStarted() {
        var pScore = this.taliGame.playerTurn();
        this.resultText.setText('Result: ' + pScore);

        this.rollBtn.on('pointerdown', () => this.playerTurn());
        this.rollBtn.setPosition(this.width/2, this.height - this.height/14).setOrigin(0.5).setAlpha(0);
        
        let eScore;
        this.events.once('diceOut', () => { eScore = this.taliGame.enemyTurn(); this.resultText.setText('Result: ' + eScore); this.calculateBeginner(pScore, eScore);});
    }

    /**
     * 
     * @param {*} pScore The player's score.
     * @param {*} eScore The enemy's score.
     */
    calculateBeginner(pScore, eScore) {
        let txt;
        if (pScore > eScore) {
            txt = 'You start!';
        }
        else {
            txt = 'Mercury starts!';
        }
        this.time.addEvent({
            delay: 4000, 
            callback: () => {
                let beginText = this.add.text(this.width/2, this.height/2, txt, {fontSize: 100, fill: '#fff', backgroundColor: '#000'}).setOrigin(0.5);
                this.time.addEvent({
                    delay: 3000,
                    callback: () => beginText.destroy()
                })
            },
            loop: false
        });
    }

    /**
     * Creates and places all the buttons for the scene.
     */
    createButtons() {
        this.rollBtn = this.add.text(this.width/2, this.height/2, 'Roll!', { fontSize: 80, fill: '#000', backgroundColor: '#fff'}).setOrigin(0.5)
        .setInteractive()
        .on('pointerover', () => this.rollBtn.setStyle({fill: 'rgba(116, 8, 9, 1)'}))
        // .on('pointerdown', () => this.taliGame.playerTurn())
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
        this.turnText = this.add.text(this.width/2, this.height/3, ' ', { fontSize: 64, fill: '#000'}).setOrigin(0.5);
        this.resultText = this.add.text(this.width/2, this.height - this.height/3, ' ', { fontSize: 64, fill: '#000'}).setOrigin(0.5);
    }

    addEventListeners() {
        this.taliGame.emitter.on('diceRolled', (arr) => {this.setDiceImages(arr)});
    }

    /**
     * Rolls the dice.
     */
    setDiceImages(arr) {
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
                    callback: () => {this.events.emit('diceIn'); this.animateDiceOut(img);},
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

    /**
     * The player's turn.
     */
    playerTurn() {
        console.log('player turn');
        this.turnText.setText('Your turn');
        this.taliGame.playerTurn();
        this.events.once('diceOut', () => this.events.emit('playerTurnEnd'));
    }

    /**
     * The enemy's turn.
     */
    enemyTurn() {
        console.log('enemy Turn');
        this.turnText.setText("Mercury's turn");
        this.taliGame.enemyTurn()
        this.events.emit('enemyTurnEnd');
    }
}