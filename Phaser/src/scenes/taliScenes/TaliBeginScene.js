import Tali from '../../tali/tali.js';
import { OptionMenuScene } from '../OptionMenuScene.js';
import TransitionController, {RGBColor} from '../../misc/transitioncontroller.js';
import { BaseScene } from '../BaseScene.js';
/**
 * @class TaliBeginScene
 * The scene for the initial rolls for Tali.
 */
export class TaliBeginScene extends BaseScene {
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

    async create(playerData) {
        let {width, height} = this.sys.game.canvas;
        this.width = width;
        this.height = height;

        this.playerData = playerData;
        console.log(this.playerData)

        await document.fonts.load('64px TaliOne');

        this.background = this.add.image(this.width / 2, this.height / 2, 'taliBackgroundPlaceholder').setDisplaySize(this.width, this.height);

        this.taliGame = new Tali(this, this.width, this.height);

        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition();
        this.addImages();
        this.createButtons();
        this.addText();
    }
    /**
     * Creates and places all the buttons for the scene.
     */
    createButtons() {
        const btnImg = this.add.image(0, 0, 'taliButton');

        const btn = this.add.text(0, 0, 'Roll!', {
            fontSize: 120,
            fill: '#fff',
            fontFamily: 'TaliOne'
        })
        .setOrigin(0.5);

        

        this.rollBtn = this.add.container(this.width/2, 4*this.height/5, [ btnImg, btn ])
        this.rollBtn.setSize(btnImg.width, btnImg.height);

        this.makeButtonShine(btnImg);

        this.rollBtn.setInteractive()
        .setScale(0.5)
        .on('pointerover', () => {
            this.shine.setAlpha(1);
            this.tweens.add({ targets: this.rollBtn, scale: 0.502, duration: 100, ease: 'Power1' });
            this.tweens.add({
                targets: this.shine,
                x: 4*this.width/5,
                duration: 500,
                ease: 'Power2',
                onComplete: () => this.shine.x = 0
            });
        })
        .on('pointerout', () => this.tweens.add({ targets: this.rollBtn, scale: 0.5, duration: 100, ease: 'Power1' }))
        .once('pointerdown', () => {
            this.continue(this.GAME_STATE.PLAYER_ROLL)
            this.shine.setAlpha(0)
        });

        this.backBtn = this.add.text(10, 10, 'Back', {fontSize: 64, fill: '#fff', fontFamily: 'TaliOne'})
        .setInteractive()
        .on('pointerover', () => this.tweens.add({targets: this.backBtn, scale: 1.1, duration: 100, ease: 'Power1'}))
        .on('pointerout', () => this.tweens.add({targets: this.backBtn, scale: 1, duration: 100, ease: 'Power1'}))
        .on('pointerdown', () => this.openOptionMenu());
        
    }


    makeButtonShine(btnImg) {
        this.shine = this.add.rectangle(
            0,            // start far left so it slides across
            4*this.height/5,
            btnImg.width,
            btnImg.height / 2,
            0xffffff,
            0.4
        );
        this.shine.setAngle(45);

        const mask = this.make.graphics();
        mask.fillStyle(0xffffff);
        mask.fillRect(this.width/2 - this.rollBtn.width/4, 4*this.height/5 - this.rollBtn.height/4, btnImg.width/2, btnImg.height/2);
        this.shine.setMask(mask.createGeometryMask());
    }

    /**
     * Adds all the images to the scene.
     */
    addImages() {
        this.boardImg = this.add.image(this.width/2, this.height/2, 'taliBoard').setOrigin(0.5).setScale(0.45);
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
        this.enemyScore = this.add.text(this.width - 20, 20, "Mercury's Score: " + this.taliGame.enemyScore, {fontSize: 50, fontFamily: 'TaliOne'}).setOrigin(1, 0);
        this.playerScore = this.add.text(20, this.height - 20, 'Your Score: ' + this.taliGame.playerScore, {fontSize: 50, fontFamily: 'TaliOne'}).setOrigin(0, 1);
        this.turnText = this.add.text(this.width/2, this.height/2.5, 'Roll to decide who begins:', { fontSize: 100, fill: '#fff', fontFamily: 'TaliOne'}).setOrigin(0.5);
        this.resultText = this.add.text(this.width/2, this.height - this.height/3, ' ', { fontSize: 64, fill: '#fff', fontFamily: 'TaliOne'}).setOrigin(0.5);
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
     * Sets the text with an animation and plays a sound.
     * @param {Text} textObject the text object to change.
     * @param {string} newText the new text to set.
     * @param {number} AnimDuration the duration of the animation
     */
    setTextWithAnimation(textObject, newText, AnimDuration = 100)
    {
        this.sound.play('TextPop', { volume: 0.5 * this.playerData.sfxVolume });
        textObject.setText(newText);
        this.tweens.add({
            targets: textObject,
            scaleX: 1.1,
            scaleY: 1.1,
            yoyo: true,
            duration: AnimDuration,
            ease: 'Power2',
        });
    }


    /**
     * The player's first roll.
     */
    playerRolls() {
        // this.animateHands();
        this.turnText.setPosition(this.width/2, this.height/3);
        this.setTextWithAnimation(this.turnText, "Your rolls:");
        this.rollBtn.setAlpha(0);
        this.playerScore = this.taliGame.playerTurn();
        this.taliGame.emitter.once('diceIn', () => {
            this.setTextWithAnimation(this.resultText, "Your result: " + this.playerScore);
            this.rollBtn.list[1].setText('Continue')
            this.rollBtn.setAlpha(1)
            .once('pointerdown', () => { this.taliGame.hideDice(); this.continue(this.GAME_STATE.ENEMY_ROLL);});
        });
    }

    /**
     * The enemy's first roll.
     */
    enemyRolls() {
        this.rollBtn.setAlpha(0);
        this.setTextWithAnimation(this.turnText, "Mercury's rolls:");
        this.enemyScore = this.taliGame.enemyTurn();
        this.taliGame.emitter.once('diceIn', () => {
            this.setTextWithAnimation(this.resultText, "Mercury's result: " + this.enemyScore);
            this.rollBtn.list[1].setText('Continue')
            this.rollBtn.setAlpha(1)
            .once('pointerdown', () => { this.taliGame.hideDice(); this.continue(this.GAME_STATE.DECISION);});
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
        this.resultText.setText('');
        if (this.playerScore === this.enemyScore) {
            this.continue(this.GAME_STATE.TIE);
        }
            else {
            if (this.playerScore > this.enemyScore) {
                this.playerFirst = true;
                this.setTextWithAnimation(this.turnText, "You begin!");
            }
            else if (this.playerScore < this.enemyScore) {
                this.playerFirst = false;
                this.setTextWithAnimation(this.turnText, "Mercury begins!");
            }
            this.continue(this.GAME_STATE.END);
        }
    }

    tie() {
        this.setTextWithAnimation(this.turnText, "It's a tie!");
        this.rollBtn.list[1].setText('Retry')
        this.rollBtn.on('pointerdown', () =>{ 
            this.transitionController.startFadeOutTransition(() => {
                 this.scene.restart();
            }, 400);
        } );
    }

    /**
     * Ends the game and starts the proper Tali Scene.
     * @sends playerFirst: true if the player begins, false if the enemy begins.
     */
    endGame() {
        this.playerData.TaliPlayerFirst = this.playerFirst;
        this.rollBtn.list[1].setText('Start Game!');
        this.rollBtn.once('pointerdown', ()=> {
            this.transitionController.startFadeOutTransition(() => {this.scene.start('TaliScene', this.playerData)});
        });
    }
}