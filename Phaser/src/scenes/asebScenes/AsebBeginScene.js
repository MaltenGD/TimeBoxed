import AsebGame from '../../aseb/AsebGame.js';
import AsebBoard from '../../aseb/AsebBoard.js';
import { OptionMenuScene } from '../OptionMenuScene.js';
import TransitionController, {RGBColor} from "../../misc/transitioncontroller.js";
import { BaseScene } from '../BaseScene.js';


/**
 * @class AsebBeginScene
 * @description handles the initial "who goes first" sequence of the Aseb game.
 * Both the player and Anubis throw the sticks, and the one with the higher score starts the game.
 */
export class AsebBeginScene extends BaseScene {
    /**
     * @property {object} GAME_STATE - The different states for the scene's flow.
     * @property {string} GAME_STATE.RECEIVING_STATE - Initial state.
     * @property {string} GAME_STATE.PLAYER_THROWS - State for when the player is throwing.
     * @property {string} GAME_STATE.ENEMY_THROWS - State for when the enemy is throwing.
     * @property {string} GAME_STATE.DECISION - State for deciding the winner.
     */
    GAME_STATE = {
        RECEIVING_STATE: 'RECEIVING_STATE',
        PLAYER_THROWS: 'PLAYER_THROWS',
        ENEMY_THROWS: 'ENEMY_THROWS',
        DECISION: 'DECISION'
    };
    constructor() {
        super('AsebBeginScene');
        /** @type {boolean} - Debug flag. If true, skips parts of the sequence. */
        this.debugMode = false; // Set to true to skip turn decision and start game immediately
        /** @type {string} - The current state of the scene's mini game flow. */
        this.state = this.GAME_STATE.RECEIVING_STATE;
    }

    /**
     * Creates the UI elements for the scene.
     */
    createGameObjects() {
        
        /** @type {Phaser.GameObjects.Image} */
        this.infoBoard = this.add.image(this.width/2, this.height/2, 'StickBoard').setOrigin(0.5).setScale(1.5).setRotation(Phaser.Math.DegToRad(90));
        
        //The text that guides the player
        /** @type {Phaser.GameObjects.Text} */
        this.infoText = this.add.text(this.width/2,250, "Let's see who goes first!", {fontSize: 64, color: '#000000ff', fontFamily: "Anubismythicalserif", align: 'center'}).setOrigin(0.5);
        /** @type {Phaser.GameObjects.Text} */
        this.scoreText = this.add.text(this.width/2,350, "", {fontSize: 64, color: '#000000ff', fontFamily: "Anubismythicalserif", align: 'center'}).setOrigin(0.5);
        
    }

    /**
     * Creates and places all the buttons for the scene.
     */
    createButtons() {

        // --- Back Button ---
        const backBtnImage = this.add.image(0, 0, 'AsebButton').setScale(0.3,0.5);
        const backBtnText = this.add.text(0, 0, 'Pause', { fontSize: 48, fill: '#000000ff', fontFamily: "Anubismythicalserif"}).setOrigin(0.5);

        this.backBtn = this.add.container(140, 80, [ backBtnImage, backBtnText ]);
        this.backBtn.setSize(backBtnImage.width * 0.5, backBtnImage.height * 0.5).setInteractive()
            .on('pointerover', () => {
                this.sound.play('buttonHover', { volume: 2 * this.playerData.sfxVolume }); 
                this.tweens.add({ targets: this.backBtn, scale: 1.1, duration: 100, ease: 'Power1' });
            })
            .on('pointerout', () => {
                this.tweens.add({ targets: this.backBtn, scale: 1.0, duration: 100, ease: 'Power1' });
            })
            .on('pointerdown', () => this.openOptionMenu());

        // --- Throw Button ---
        this.throwBtnImage = this.add.image(0, 0, 'AsebButton').setScale(0.6);
        this.throwBtnText = this.add.text(0, 0, 'Throw', { fontSize: 68, fill: '#000000ff', fontFamily: "Anubismythicalserif"}).setOrigin(0.5);

        /** @type {Phaser.GameObjects.Container} */
        this.throwBtn = this.add.container(this.width/2, this.height - 300, [ this.throwBtnImage, this.throwBtnText ]);
        this.throwBtn.setSize(this.throwBtnImage.width, this.throwBtnImage.height).setInteractive()
            .on('pointerover', () => {
                if (this.throwBtn.active) {
                    this.sound.play('buttonHover', { volume: 2 * this.playerData.sfxVolume }); 
                    this.tweens.add({
                        targets: this.throwBtn,
                        scale: 1.1,
                        duration: 100,
                        ease: 'Power1',
                    });
                }
        })
        .on('pointerout', () => {
            if (this.throwBtn.active) {
                this.tweens.add({
                    targets: this.throwBtn,
                    scale: 1.0,
                    duration: 100,
                    ease: 'Power1',
                }); 
            }
        })
        .on('pointerdown', () => this.continue(this.GAME_STATE.PLAYER_THROWS));
        
    }
 
    /**
     * Advances the scene's state machine.
     * @param {string} newState - The new state to transition to, from `this.GAME_STATE`.
     */
    continue(newState)
    {
        this.setObjectState(this.throwBtn, false);
        this.gameState = newState;
        
        if (this.gameState === this.GAME_STATE.PLAYER_THROWS) {
            this.playerInitialThrow();
        } else if (this.gameState === this.GAME_STATE.ENEMY_THROWS) {
            this.enemyInitialThrow();
        }
        else if (this.gameState === this.GAME_STATE.DECISION) {
            this.announceBeginner();
        }

    }

    /**
     * The main creation function for the scene. Sets up game objects and buttons.
     */
    async create(playerData)  // El async se debe a que quiero esperar a que cargue la font, en caso de no usar async, la font puede no cargar a tiempo
    {

        let {width, height} = this.sys.game.canvas;
        this.width = width;
        this.height = height;

        this.playerData = playerData;

        // Hasta que no se haya cargado la font en esta escena no continua
        await document.fonts.load('64px Anubismythicalserif');
        console.log(this.playerData)

        const baseMusicVolume = 0.25;
            this.music = this.sound.add('CreepyegyptMusic', { loop: true, volume: baseMusicVolume * this.playerData.musicVolume });
            this.soundInstances.push({ 
                sound: this.music, 
                type: 'music', 
                baseVolume: baseMusicVolume 
            });
            this.music.play();

        this.playerData.EgyptIntroCompleted = true;

        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition();

        this.background = this.add.image(this.width/ 2, this.height / 2, 'asebBackground').setDisplaySize(this.width, this.height);
        /** @type {AsebGame} */
        this.asebGame = new AsebGame(this);

        
        this.createGameObjects();

        this.createButtons();

    }
    
    /**
     * Handles player's turn to throw the sticks.
     */
    playerInitialThrow() {
        this.playerStickResult = this.asebGame.getThrow();
        this.setTextWithAnimation(this.infoText, "You threw the sticks");
        
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                
            this.showSticks(this.playerStickResult.throwResult);
            this.setTextWithAnimation(this.scoreText, "You got " + this.playerStickResult.Sum + " points");
            this.throwBtnText.setText('Continue');
            this.setObjectState(this.throwBtn, true);
            this.throwBtn
                .on('pointerdown', () => this.continue(this.GAME_STATE.ENEMY_THROWS));
            
        
            }
     });
    }

    /**
     * Handles Anubis's turn to throw the sticks.
     */
    enemyInitialThrow() {
        this.clearSticks();
        this.scoreText.setText("");
        this.enemyStickResult = this.asebGame.getThrow();
        this.setTextWithAnimation(this.infoText, "Anubis threw the sticks");

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                
            this.showSticks(this.enemyStickResult.throwResult);
            this.setTextWithAnimation(this.scoreText, "Anubis got " + this.enemyStickResult.Sum + " points");
            this.setObjectState(this.throwBtn, true);
            this.throwBtn
                .off('pointerdown')
                .on('pointerdown', () => this.continue(this.GAME_STATE.DECISION));
            
            }
     });


    }

    /**
     * Compares the player's and enemy's throw results and announces who starts the game.
     */
    announceBeginner() {

        this.clearSticks();
        this.scoreText.setText("");

        if (this.playerStickResult.Sum > this.enemyStickResult.Sum) {
            this.setTextWithAnimation(this.infoText, 'You begin!');
            this.playerData.AsebPlayerFirst = true;
        } else if (this.enemyStickResult.Sum > this.playerStickResult.Sum) {
            this.setTextWithAnimation(this.infoText, 'Anubis begins!');
            this.playerData.AsebPlayerFirst = false;
        } else {
            this.setTextWithAnimation(this.infoText, "It's a tie!\nYou start anyway.");
            this.playerData.AsebPlayerFirst = true;
        }

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.throwBtnImage.setScale(0.8);
                this.throwBtnText.setText('Start Game');
                this.setObjectState(this.throwBtn, true);
                this.throwBtn
                .off('pointerdown')
                .on('pointerdown', () => 
                    {

                    this.transitionController.startFadeOutTransition(() => {
                        this.scene.start('AsebScene', this.playerData);
                    }, 400);
                    }
                    
                );
            }
        })
        
    }


    /**
     * Displays the stick images on screen based on the throw results.
     * @param {number[]} throws - An array of 1s and 0s representing the stick throw result.
     */
    showSticks(throws)
    {
        if (!throws) {
            console.error("showSticks was called with an undefined value.");
            return; // Exit the function to prevent a crash
        }

        /** @type {Phaser.GameObjects.Image[]} */
        this.stickImages = []; // Array to hold the stick images
        const stickSpacing = 100; // Space between sticks
        const startX = this.width / 2 - (stickSpacing * 1.5); // Initial X position to center the 4 sticks
        const yPos = this.height / 2; // Y position in the center of the screen

        throws.forEach((element, index) => {
            const stickX = startX + (index * stickSpacing);
            const stickImageKey = (element === 1) ? 'StickLight' : 'StickDark';
            
            // Create the stick with alpha 0 (invisible)
            const stick = this.add.image(stickX, yPos, stickImageKey)
                .setOrigin(0.5)
                .setScale(0.5)
                .setAlpha(0);

            this.stickImages.push(stick);

            // Add a fade-in tween for each stick
            this.tweens.add({
                targets: stick,
                alpha: 1, // Fade to fully visible
                duration: 500, // Animation duration in ms
                ease: 'Power2'
            });

            // Brings the stick to the top of the display list to show it above the infoBoard
            this.children.bringToTop(stick);
        });
    }

    /**
     * Fades out and destroys the currently displayed stick images.
     * @param {function} [onCompleteCallback] - An optional function to call after the sticks are cleared.
     */
    clearSticks(onCompleteCallback) {
        if (this.stickImages && this.stickImages.length > 0) {
            // Add a fade-out tween for each stick
            this.tweens.add({
                targets: this.stickImages,
                alpha: 0, // Fade to invisible
                duration: 500, // Animation duration in ms
                ease: 'Power2',
                onComplete: () => {
                    // Once the tween is complete, destroy the game objects
                    this.stickImages.forEach(stick => stick.destroy());
                    this.stickImages = []; // Clear the array
                    if (onCompleteCallback) {
                        onCompleteCallback(); // Execute the callback after cleanup
                    }
                }
            });
        }
    }

    /**
     * A utility function to set the interactive and active state of a game object.
     * @param {Phaser.GameObjects.GameObject} object - The game object to modify.
     * @param {boolean} state - The desired state (true for interactive/active, false for non-interactive/inactive).
     */
    setObjectState(object, state) {
        if (object === this.throwBtn) {
            this.animateButtonState(object, state);
        } else {
            object.setActive(state);
            object.setVisible(state);
        }
    }

    /**
     * Animates a button's appearance or disappearance.
     * @param {Phaser.GameObjects.Container} button - The button container to animate.
     * @param {boolean} show - True to animate in, false to animate out.
     * @param {number} [duration=300] - The duration of the animation.
     */
    animateButtonState(button, show, duration = 300) {
        if (show) {
            button.setActive(true).setVisible(true);
            this.tweens.add({
                targets: button,
                scale: 1,
                alpha: 1,
                duration: duration,
                ease: 'Power2'
            });
        } else {
            button.off('pointerdown'); // Disable clicks immediately
            this.tweens.add({
                targets: button,
                scale: 0,
                alpha: 0,
                duration: duration,
                ease: 'Power2',
                onComplete: () => {
                    button.setActive(false).setVisible(false);
                }
            });
        }
    }
    setTextWithAnimation(textObject, newText, AnimDuration = 175)
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

    shutdownMusic() {
        // Stop the music when the scene is shut down
        if (this.music && this.music.isPlaying) {
            this.music.stop();
        }
    }

    

}