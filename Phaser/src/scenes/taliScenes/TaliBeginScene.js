import Tali from '../../tali/tali.js';

/**
 * @class TaliBeginScene
 * The scene for the initial rolls for Tali.
 */
export class TaliBeginScene extends Phaser.Scene {
    GAME_STATE = {
        PLAYER_ROLL: 'PLAYER_ROLL',
        ENEMY_ROLL: 'ENEMY_ROLL',
        DECISION: 'DECISION',
        TIE: 'TIE',
        END: 'END'
    }

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
    }

    create() {
        this.taliGame = new Tali(this, this.width, this.height);
        this.addImages();
        // this.addHands();
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
        .once('pointerdown', () => this.continue(this.GAME_STATE.PLAYER_ROLL));

        this.backBtn = this.add.text(0, 0, 'Back', { fontSize: 64, fill: '#fff'})
        .setInteractive()
        .on('pointerover', () => this.backBtn.setStyle({fill: '#0f0'}))
        .on('pointerdown', () => {
            if (this.scene.isActive('PauseMenu')) return;

            this.scene.launch('PauseMenu');
            const pauseMenu = this.scene.get('PauseMenu');
            pauseMenu.setPausedScene(this.scene.key);
            this.scene.pause();
        })
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

    animateHands() {
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
     * The player's first roll.
     */
    playerRolls() {
        // this.animateHands();
        this.turnText.setText('Your rolls: ');
        this.rollBtn.setAlpha(0);
        this.playerScore = this.taliGame.playerTurn();
        this.taliGame.emitter.once('diceIn', () => this.resultText.setText('Your result: ' + this.playerScore));
        this.taliGame.emitter.once('diceOut', () => { 
            this.resultText.setText(' ');
            this.rollBtn.setText('Continue').setAlpha(1)
                .once('pointerdown', () => this.continue(this.GAME_STATE.ENEMY_ROLL));
        });
    }

    /**
     * The enemy's first roll.
     */
    enemyRolls() {
        this.rollBtn.setAlpha(0);
        this.turnText.setText("Mercury's rolls: ");
        this.enemyScore = this.taliGame.enemyTurn();
        this.taliGame.emitter.once('diceIn', () => {
            this.resultText.setText("Mercury's result: " + this.enemyScore); 
            this.taliGame.emitter.once('diceOut', () => {
                this.resultText.setText(' ');
                this.rollBtn.setText('Continue').setAlpha(1)
                    .once('pointerdown', () => this.continue(this.GAME_STATE.DECISION));
            });
        });
    }

    /**
     * Advances the scene's state machine.
     * @param {string} state - the state to transition to.
     */
    continue(state) {
        this.gameState = state;
        console.log(this.gameState);
        if (this.gameState === this.GAME_STATE.PLAYER_ROLL) {
            this.playerRolls();
        }
        else if (this.gameState === this.GAME_STATE.ENEMY_ROLL) {
            this.enemyRolls();
        }
        else if (this.gameState === this.GAME_STATE.DECISION) 
        {
            this.calculateBeginner();
        }
        else if (this.gameState === this.GAME_STATE.TIE) {
            this.tie();
        }
        else if (this.gameState === this.GAME_STATE.END) {
            this.endGame();
        }
    }

    /**
     * Calculates the beginner and shows it on the screen.
     */
    calculateBeginner() {
        if (this.playerScore === this.enemyScore) {
            this.continue(this.GAME_STATE.TIE);
        }
            else {
            if (this.playerScore > this.enemyScore) {
                this.playerFirst = true;
                this.turnText.setText('You begin!');
            }
            else if (this.playerScore < this.enemyScore) {
                this.playerFirst = false;
                this.turnText.setText("Mercury begins!");
            }
            this.continue(this.GAME_STATE.END);
        }

        
    }

    tie() {
        this.turnText.setText("It's a tie!");
        this.time.addEvent({
            delay: 1000,
            callback: () =>
            {
                this.scene.restart();
            }
        })
    }

    /**
     * Ends the game and starts the proper Tali Scene.
     * @sends playerFirst: true if the player begins, false if the enemy begins.
     */
    endGame() {
        this.rollBtn.setText('Continue').on('pointerdown', ()=> {
            this.scene.start('TaliScene', {playerFirst: this.playerFirst});
        });
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