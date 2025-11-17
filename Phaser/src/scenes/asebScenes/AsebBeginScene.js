import AsebGame from '../../aseb/AsebGame.js';
import AsebBoard from '../../aseb/AsebBoard.js';
import { OptionMenuScene } from '../OptionMenuScene.js';



/**
 * @class AsebBeginScene
 * @description A Phaser Scene that handles the initial "who goes first" sequence of the Aseb game.
 * Both the player and Anubis throw the sticks, and the one with the higher score starts the game.
 */
export class AsebBeginScene extends Phaser.Scene {
    /**
     * @property {object} GAME_STATE - The different states for the scene's flow.
     * @property {string} GAME_STATE.RECEIVING_STATE - Initial state.
     * @property {string} GAME_STATE.PLAYER_THROWS - State for when the player is throwing.
     * @property {string} GAME_STATE.ENEMY_THROWS - State for when the enemy is throwing.
     * @property {string} GAME_STATE.DECISSION - State for deciding the winner.
     */
    GAME_STATE = {
        RECEIVING_STATE: 'RECEIVING_STATE',
        PLAYER_THROWS: 'PLAYER_THROWS',
        ENEMY_THROWS: 'ENEMY_THROWS',
        DECISSION: 'DECISSION'
    };
    constructor() {
        super('AsebBeginScene');
        /** @type {boolean} - Debug flag. If true, might skip parts of the sequence. */
        this.debugMode = false; // Set to true to skip turn decision and start game immediately
        /** @type {string} - The current state of the scene's mini game flow. */
        this.state = this.GAME_STATE.RECEIVING_STATE;
    }

    /**
     * Preloads all necessary assets for this scene.
     */
     preload() {
        /** @type {number} */
        let {width, height} = this.sys.game.canvas;
        this.width = width;
        this.height = height;
    }

    /**
     * Creates the UI elements for the scene.
     */
    createGameObjects() {
        
        /** @type {Phaser.GameObjects.Image} */
        this.infoBoard = this.add.image(this.width/2, this.height/2, 'StickBoard').setOrigin(0.5).setScale(0.5);
        
        //The text that guides the player
        /** @type {Phaser.GameObjects.Text} */
        this.infoText = this.add.text(this.width/2,250, "Lets decide who goes first!", {fontSize: 64, color: '#000000ff'}).setOrigin(0.5);
        /** @type {Phaser.GameObjects.Text} */
        this.scoreText = this.add.text(this.width/2,350, "*", {fontSize: 64, color: '#000000ff'}).setOrigin(0.5);
        
    }

    /**
     * Creates and places all the buttons for the scene.
     */
    createButtons() {

 
        /** @type {Phaser.GameObjects.Text} */
        this.backBtn = this.add.text(0, 0, 'Back', { fontSize: 64, fill: '#000000ff'})
        .setInteractive()
        .on('pointerover', () => this.backBtn.setStyle({fill: 'rgba(104, 35, 35, 1)'}))
        .on('pointerout', () => this.backBtn.setStyle({fill: '#000000ff'}))
        .on('pointerdown', () => {
            this.openOptionMenu();
        });
        
        /** @type {Phaser.GameObjects.Text} */
        this.throwBtn = this.add.text(this.width/2 -100, this.height -300, 'Throw', { fontSize: 64, fill: '#000000ff'})
        .setInteractive()
        .on('pointerover', () => this.throwBtn.setStyle({fill: '#0f0'}))
        .on('pointerout', () => this.throwBtn.setStyle({fill: '#000000ff'}))
        .on('pointerdown', () => this.continue(this.GAME_STATE.PLAYER_THROWS));

       

    }
 
    /**
     * Advances the scene's state machine.
     * @param {string} newState - The new state to transition to, from `this.GAME_STATE`.
     */
    continue(newState)
    {
        this.gameState = newState;
        
        if (this.gameState === this.GAME_STATE.PLAYER_THROWS) {
            this.playerInitialThrow();
        } else if (this.gameState === this.GAME_STATE.ENEMY_THROWS) {
            this.enemyInitialThrow();
        }
        else if (this.gameState === this.GAME_STATE.DECISSION) {
            this.announceBeginner();
        }

    }

    /**
     * The main creation function for the scene. Sets up game objects and buttons.
     */
    create() 
    {
        this.background = this.add.image(this.width/ 2, this.height / 2, 'asebBackgroundPlaceholder').setDisplaySize(this.width, this.height);
        /** @type {AsebGame} */
        this.asebGame = new AsebGame(this);
        this.createGameObjects();

        this.createButtons();

        this.input.keyboard.on('keydown-ESC', () => {
           this.openOptionMenu();
        });
            
    }
    
    /**
     * Handles player's turn to throw the sticks.
     */
    playerInitialThrow() {
        this.playerStickResult = this.asebGame.getThrow();
        this.infoText.setText("You threw the sticks")
        
        this.throwBtn.off('pointerdown')
        this.throwBtn.setText("");

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                
            this.showSticks(this.playerStickResult.throwResult);
            this.scoreText.setText("You got " + this.playerStickResult.Sum)
            this.throwBtn.setText('Continue')
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
        this.infoText.setText("Anubis threw the sticks")

        this.throwBtn.off('pointerdown')
        this.throwBtn.setText("");
        
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                
            this.showSticks(this.enemyStickResult.throwResult);
            this.scoreText.setText("Anubis got " + this.enemyStickResult.Sum)
            this.throwBtn.setText('Continue')
                .off('pointerdown') // Remove existing listeners
                .on('pointerdown', () => this.continue(this.GAME_STATE.DECISSION));
            
            }
     });


    }

    /**
     * Compares the player's and enemy's throw results and announces who starts the game.
     */
    announceBeginner() {

        this.clearSticks();
        this.scoreText.setText("");

        this.throwBtn.off('pointerdown')

        if (this.playerStickResult.Sum > this.enemyStickResult.Sum) {
            this.infoText.setText('You begin!');
            this.playerFirst = true;
        } else if (this.enemyStickResult.Sum > this.playerStickResult.Sum) {
            this.infoText.setText('Anubis begins!');
            this.playerFirst = false;
        } else {
            this.infoText.setText("It's a tie! You start anyways.");
            this.playerFirst = true;
        }

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.startActualGame();
            }
        })
        
    }

    /**
     * Starts the main Aseb game scene, passing the result of who goes first.
     */
    startActualGame() {
        // Changes the Scene
        this.scene.start('AsebScene', {playerFirst: this.playerFirst});
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
    setObjectState(object, state)
    {
        object.setInteractive(state);
        object.setActive(state);

    }

    openOptionMenu()
    {
        if (this.scene.isActive('OptionMenu')) return;
            this.scene.pause();
            this.scene.launch('OptionMenu', { sceneToPause: this.scene.key });
    }

}