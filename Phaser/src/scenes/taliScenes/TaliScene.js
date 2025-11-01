import Tali from '../../tali/tali.js';
/**
 * @class TaliScene
 * The scene for the Tali game (Rome).
 */
export class TaliScene extends Phaser.Scene {
    turnText;
    resultText;
    
    enemyScore;
    playerScore;

    currentRoll = [0, 0, 0, 0];

    playerFirst;
    
    diceImages = [];

    constructor() {
        super('TaliScene');
    }

    init(data) {
        if (data !== undefined) this.playerFirst = data.playerFirst;
        else this.playerFirst = true;
    }

    preload() {
        let {width, height} = this.sys.game.canvas;
        this.width = width;
        this.height = height;
        
        // this.loadImages();
    }

    // /**
    //  * Loads all the tali images.
    //  */
    // loadImages() {
    //     this.load.image('board', 'Phaser/assets/tali/temporary_board.png');
    //     for (let i = 0; i < Tali.NUMBER_OF_DICE; i++) { 
    //         this.load.image('dice' + i, 'Phaser/assets/tali/temporary_dice' + i + '.png');
    //     }
    // }

    create() {
        console.log(this.playerFirst ? "Player starts." : "Mercury starts.");

        this.taliGame = new Tali(this, this.width, this.height);

        this.addImages();
        this.createButtons();
        this.addText();
        this.addEventListeners();   
    }

    /**
     * Creates and places all the buttons for the scene.
     */
    createButtons() {
        this.rollBtn = this.add.text(this.width/2, this.height/2, 'Roll!', { fontSize: 80, fill: '#000', backgroundColor: '#fff'}).setOrigin(0.5)
        .setInteractive()
        .on('pointerover', () => this.rollBtn.setStyle({fill: 'rgba(116, 8, 9, 1)'}))
        .on('poinerdown', () => this.taliGame.rollDice())
        .on('pointerout', () => this.rollBtn.setStyle({fill: '#000'}));

        this.backBtn = this.add.text(0, 0, 'Back', { fontSize: 64, fill: '#fff'})
        .setInteractive()
        .on('pointerover', () => this.backBtn.setStyle({fill: '#0f0'}))
        .on('pointerdown', () => this.scene.start('SelectionMenuScene'))
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
        this.taliGame.emitter.on('turnEnded', () => {
            this.nextTurn();
        })
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
}