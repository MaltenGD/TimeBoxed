import Tali from '../../tali/tali.js';

/**
 * @class TaliBeginScene
 * The scene for the initial rolls for Tali.
 */
export class TaliBeginScene extends Phaser.Scene {
    turnText;
    resultText;
    
    boardImg;
    diceImages = [0, 0, 0, 0];

    currentRoll = [0, 0, 0, 0];
    
    playerScore;
    enemyScore;

    playerFirst = true;

    constructor() {
        super('TaliBeginScene');
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
        this.load.image('taliBoard', 'Phaser/assets/tali/temporary_board.png');
        for (let i = 0; i < Tali.NUMBER_OF_DICE; i++) { 
            this.load.image('dice' + i, 'Phaser/assets/tali/temporary_dice' + i + '.png');
        }
        this.load.image('VENUS', 'Phaser/assets/tali/temporary_throw0.png')
        this.load.image('MARTE', 'Phaser/assets/tali/temporary_throw1.png')
        this.load.image('JUPITER', 'Phaser/assets/tali/temporary_throw2.png')
        this.load.image('NEPTUNO', 'Phaser/assets/tali/temporary_throw3.png')
        this.load.image('LUNA', 'Phaser/assets/tali/temporary_throw4.png')
    }

    create() {
        this.taliGame = new Tali(this, this.width, this.height);
        this.addImages();
        this.addHands();
        this.createButtons();
        this.addText();
    }

    /**
     * Creates and places all the buttons for the scene.
     */
    createButtons() {
        this.rollBtn = this.add.text(this.width/2, this.height/2, 'Roll!', { fontSize: 80, fill: '#000', backgroundColor: '#fff'}).setOrigin(0.5)
        .setInteractive()
        .on('pointerover', () => this.rollBtn.setStyle({fill: 'rgba(116, 8, 9, 1)'}))
        .on('pointerout', () => this.rollBtn.setStyle({fill: '#000'}))
        .once('pointerdown', () => this.startGame());

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
        this.boardImg = this.add.image(this.width/2, this.height/2, 'taliBoard').setOrigin(0.5).setScale(0.6);
    }

    addHands() {
    // Brazo del jugador que viene desde abajo
    this.playerArm = this.add.rectangle(
        this.width / 2,
        this.height + 700,  // empieza fuera de la pantalla
        120,                // ancho del brazo
        500,                // largo del brazo
        0xff5555            // color rojizo
    ).setOrigin(0.5, 1);

    // Brazo del enemigo: viene desde arriba
    this.enemyArm = this.add.rectangle(
        this.width / 2,
        -700,               // empieza fuera de la pantalla
        120,
        500,
        0x5555ff            // color azulado
    ).setOrigin(0.5, 0);

    this.playerArm.setAlpha(0);
    this.enemyArm.setAlpha(0);
}

    /**
     * Adds all the text to the scene.
     */
    addText() {
        this.enemyScore = this.add.text(this.width - 20, 20, "Mercury's Score: " + this.taliGame.enemyScore, {fontSize: 32}).setOrigin(1, 0);
        this.playerScore = this.add.text(20, this.height - 20, 'Your Score: ' + this.taliGame.playerScore, {fontSize: 32}).setOrigin(0, 1);
        this.turnText = this.add.text(this.width/2, this.height/3, 'Roll to decide who begins:', { fontSize: 64, fill: '#000'}).setOrigin(0.5);
        this.resultText = this.add.text(this.width/2, this.height - this.height/3, ' ', { fontSize: 64, fill: '#000'}).setOrigin(0.5);
    }

    /**
     * Adds all the event listeners.
     */
    addEventListeners() {
        this.taliGame.emitter.on('diceRolled', (arr) => {this.setDiceImages(arr)});
    }

    animateThrow() {
    // Mostrar brazos
    this.playerArm.setAlpha(1);
    this.enemyArm.setAlpha(1);

    const enterDepth = 10;

    // Animacion del brazo del jugador (sube y baja)
    this.tweens.add({
        targets: this.playerArm,
        y: this.height - enterDepth,  // entra hasta el centro
        duration: 190,
        ease: 'Sine.easeInOut',
        yoyo: true,
        hold: 80,
        onYoyo: () => {
            this.playerArm.setAlpha(0); // desaparece al volver
        }
    });

    // Animacion del brazo del enemigo (baja y sube)
    this.tweens.add({
        targets: this.enemyArm,
        y: enterDepth,
        duration: 190,
        ease: 'Sine.easeInOut',
        yoyo: true,
        hold: 80,
        onYoyo: () => {
            this.enemyArm.setAlpha(0);
        }
    });
}

    /**
     * Begin the rolls.
     */
    startGame() {
        this.playerRolls();
        this.events.once('playerRollDone', () => this.enemyRolls());
        this.events.once('enemyRollDone', () => this.calculateBeginner());
        this.events.once('beginnerAnnounced', () => this.endGame());
    }
    

    /**
     * The player's first roll.
     */
    playerRolls() {
        this.animateThrow();
        this.turnText.setText('Your rolls: ');
        this.rollBtn.setAlpha(0);
        this.playerScore = this.taliGame.playerTurn();
        this.taliGame.emitter.once('diceIn', () => this.resultText.setText('Your result: ' + this.playerScore));
        this.taliGame.emitter.once('diceOut', () => { this.resultText.setText(' '); this.events.emit('playerRollDone'); });
    }

    /**
     * The enemy's first roll.
     */
    enemyRolls() {
        this.animateThrow();
        this.turnText.setText("Mercury's rolls: ");
        this.enemyScore = this.taliGame.enemyTurn();
        this.taliGame.emitter.once('diceIn', () => {
            this.resultText.setText("Mercury's result: " + this.enemyScore); 
            this.taliGame.emitter.once('diceOut', () => {
                this.events.emit('enemyRollDone');
                this.resultText.setText('');
            });
        });
    }

    /**
     * Calculates the beginner and shows it on the screen.
     */
    calculateBeginner() {
        if (this.playerScore > this.enemyScore) {
            this.playerFirst = true;
            this.turnText.setText('You begin!');
        }
        else if (this.playerScore < this.enemyScore) {
            this.playerFirst = false;
            this.turnText.setText("Mercury begins!");
        }
        else {
            this.playerFirst = true;
            this.turnText.setText("It's a tie! Mercury lets you begin.");
        }
        this.events.emit('beginnerAnnounced');
    }

    /**
     * Ends the game and starts the proper Tali Scene.
     * @sends playerFirst: true if the player begins, false if the enemy begins.
     */
    endGame() {
        console.log("switching scenes: " + this.playerFirst);
        this.time.addEvent(
            {
                delay: 2000,
                loop: false,
                callback: () => this.scene.start('TaliScene', {playerFirst: this.playerFirst})
            }
        );
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
    // animateDiceIn(img) {
    //     this.tweens.add({
    //         targets: img,
    //         alpha: 1,
    //         duration: 1000,
    //         ease: 'Sine.easeOut',
    //         onComplete: () => {
    //             this.events.emit('diceIn');
    //             this.time.addEvent({
    //                 delay: 2000, 
    //                 callback: () => { this.animateDiceOut(img);},
    //                 loop: false
    //             });
    //         }
    //     })
    // }
    animateDiceIn(img) {
    let rollInterval = this.time.addEvent({
        delay: 100,
        callback: () => {
            const randomFace = Phaser.Math.Between(0, Tali.NUMBER_OF_DICE - 1);
            img.setTexture('dice' + randomFace);
        },
        loop: true
    });

    this.tweens.add({
        targets: img,
        alpha: 1,
        duration: 1000,
        ease: 'Sine.easeOut',
        onComplete: () => {
            rollInterval.remove(); // para el “giro”
            img.setTexture('dice' + this.currentRoll[this.diceImages.indexOf(img)]); // cara real
            this.events.emit('diceIn');
            this.time.addEvent({
                delay: 2000,
                callback: () => { this.animateDiceOut(img); },
                loop: false
            });
        }
    });
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