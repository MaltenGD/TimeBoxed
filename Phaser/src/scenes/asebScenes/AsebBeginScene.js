import AsebGame from '../../aseb/AsebGame.js';
import AsebBoard from '../../aseb/AsebBoard.js';



export class AsebBeginScene extends Phaser.Scene {
    // Game states
    GAME_STATE = {
        RECEIVING_STATE: 'RECEIVING_STATE',
        PLAYER_THROWS: 'PLAYER_THROWS',
        ENEMY_THROWS: 'ENEMY_THROWS',
        DECISSION: 'DECISSION'
    };
    constructor() {
        super('AsebBeginScene'); 
        this.debugMode = false; // Set to true to skip turn decision and start game immediately
        this.state = this.GAME_STATE.RECEIVING_STATE;
    }

     preload() {
        let {width, height} = this.sys.game.canvas;
        this.width = width;
        this.height = height;
        
        this.loadImages();
    }

    /**
     * Loads all the aseb images.
     */
            
    loadImages() {
            this.load.image('StickBoard', 'Phaser/assets/aseb/stickBoard.png');
            this.load.image('StickLight', 'Phaser/assets/aseb/AsebStickLight.png');
            this.load.image('StickDark', 'Phaser/assets/aseb/AsebStickDark.png');     
    }


    createGameObjects() {
        
        this.infoBoard = this.add.image(this.width/2, this.height/2, 'StickBoard').setOrigin(0.5).setScale(0.5);
        
        //The text that guides the player
        this.infoText = this.add.text(this.width/2,250, "Lets decide who goes first!", {fontSize: 64, color: '#ffffffff'}).setOrigin(0.5);
        this.scoreText = this.add.text(this.width/2,350, "*", {fontSize: 64, color: '#ffffffff'}).setOrigin(0.5);
        
    }

    /**
     * Creates and places all the buttons for the scene.
     */
    createButtons() {

 
        this.backBtn = this.add.text(0, 0, 'Back', { fontSize: 64, fill: '#fff'})
        .setInteractive()
        .on('pointerover', () => this.backBtn.setStyle({fill: '#0f0'}))
        .on('pointerout', () => this.backBtn.setStyle({fill: '#fff'}))
        .on('pointerdown', () => this.scene.start('SelectionMenuScene'));

        this.throwBtn = this.add.text(this.width/2 -100, this.height -300, 'Throw', { fontSize: 64, fill: '#fff'})
        .setInteractive()
        .on('pointerover', () => this.throwBtn.setStyle({fill: '#0f0'}))
        .on('pointerout', () => this.throwBtn.setStyle({fill: '#fff'}))
        .on('pointerdown', () => this.continue(this.GAME_STATE.PLAYER_THROWS));

       

    }
 
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

    create() 
    {


        this.asebGame = new AsebGame(this);
        this.createGameObjects();

        this.createButtons();
            
    }

    startDecissionSequence() {
        console.log("throw button working")
        this.playerInitialThrow();
    }
    

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

    // --- MAIN GAME LOOP ---

    startActualGame() {
        // Changes the Scene
        this.scene.start('AsebScene', {playerFirst: this.playerFirst});
    }

    showSticks(throws)
    {
        if (!throws) {
            console.error("showSticks was called with an undefined value.");
            return; // Exit the function to prevent a crash
        }

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

            // Bring the stick to the top of the display list to ensure it's visible above the infoBoard
            this.children.bringToTop(stick);
        });
    }

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

    setObjectState(object, state)
    {
        object.setInteractive(state);
        object.setActive(state);

    }

}