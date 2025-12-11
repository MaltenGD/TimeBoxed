import AsebGame, { GAME_STATE } from '../../aseb/AsebGame.js';
import AsebBoard from '../../aseb/AsebBoard.js';
import { OptionMenuScene } from '../OptionMenuScene.js';
import { PIECE_TYPE } from '../../aseb/AsebPiece.js';
import TransitionController, {RGBColor} from "../../misc/transitioncontroller.js";
import { BaseScene } from '../BaseScene.js';



/**
 * @class AsebScene
 * @description The main scene for the actual Aseb game.
 * This scene manages the game flow, and the board events.
 */
export class AsebScene extends BaseScene {
        constructor() {
            super('AsebScene'); 
            this.debugMode = false;
        }


        preload() {
            let {width, height} = this.sys.game.canvas;
            this.width = width;
            this.height = height;

            this.boardAnchor = {
                x: width/2,
                y: height/2
            }
            
        }


    /*
     * Creates the game objects and sets up the scene.
     */
    async create(playerData){

        this.playerData = playerData;
        console.log(this.playerData)

        // Default to player going first if no data is passed.
            if (playerData !== undefined) this.playerFirst = playerData.AsebPlayerFirst
            else this.playerFirst = true;

        // Wait for the custom font to be loaded before creating any text
        // The font size here doesn't matter, it just ensures the font family is ready.
        await document.fonts.load('64px Anubismythicalserif');

        const baseMusicVolume = 0.08;
            this.music = this.sound.add('AsebMusic', { loop: true, volume: baseMusicVolume * this.playerData.musicVolume });
            this.soundInstances.push({ 
                sound: this.music, 
                type: 'music', 
                baseVolume: baseMusicVolume 
            });
            this.music.play();

        // Flags for the aseb achievements
        this.anyPieceCaptured = false;

        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition();

        this.background = this.add.image(this.width / 2, this.height / 2, 'asebBackground').setDisplaySize(this.width, this.height);
        this.infoBoard = this.add.image(this.width/2, this.height/2, 'StickBoard').setOrigin(0.5).setScale(1.5,2.25).setRotation(Phaser.Math.DegToRad(90));

        const backBtnImage = this.add.image(0, 0, 'AsebButton').setScale(0.3,0.5);
        const backBtnText = this.add.text(0, 0, 'Pause', { fontSize: 48, fill: '#000000ff', fontFamily: "Anubismythicalserif"}).setOrigin(0.5);

        this.backBtn = this.add.container(140, 80, [ backBtnImage, backBtnText ]);
        this.backBtn.setSize(backBtnImage.width * 0.5, backBtnImage.height * 0.5).setInteractive()
            .on('pointerover', () => {
                
                this.tweens.add({ targets: this.backBtn, scale: 1.1, duration: 100, ease: 'Power1' });
            })
            .on('pointerout', () => {
                this.tweens.add({ targets: this.backBtn, scale: 1.0, duration: 100, ease: 'Power1' });
            })
            .on('pointerdown', () => this.openOptionMenu());

        if (this.playerData.DebugMode)
        {
            this.winBtn = this.add.text(0, 70, 'Win Game', { fontSize: 64, fill: '#000000ff'})
            .setInteractive()
            .on('pointerover', () => this.winBtn.setStyle({fill: '#0f0'}))
            .on('pointerout', () => this.winBtn.setStyle({fill: '#000000ff'}))
            .on('pointerdown', () => {
                this.asebGame.state = GAME_STATE.PLAYER_VICTORY;
                this.nextTurn();
            }).setDepth(100) // Es feo poner 100 pero es solo para la presentación. No tiene importancia ¿verdad?; 

            this.loseBtn = this.add.text(350, 70, 'Lose Game', { fontSize: 64, fill: '#000000ff'})
            .setInteractive()
            .on('pointerover', () => this.loseBtn.setStyle({fill: '#f00'}))
            .on('pointerout', () => this.loseBtn.setStyle({fill: '#000000ff'}))
            .on('pointerdown', () => {
                this.asebGame.state = GAME_STATE.ENEMY_VICTORY;
                this.nextTurn();
            }).setDepth(100);
        }

        console.log(this.playerFirst ? "Player starts the game." : "Anubis starts the game.");

        this.asebGame = new AsebGame(this, this.playerFirst);

        this.board = new AsebBoard(this,this.boardAnchor.x,this.boardAnchor.y,'asebBoard');

        /** @type {number} The pause time in milliseconds for showing information to the player. */
        this.pauseTime = 1600       // 1600 milliseconds

        // --- Board Event Listeners ---

        this.board.on('pieceMoved', (piece) => {
            this.board.setPlayerPieceInteractable(false);
            this.nextTurn();
        });
        this.board.on('SpecialPosition', (pieceType) => { // If any
            
            if (pieceType === PIECE_TYPE.PLAYER) {
                
                this.board.setPlayerPieceInteractable(false); 

                this.setTextWithAnimation(this.infoText, "You landed on a special position,\nyou've been blessed with another turn");
                this.time.addEvent({
                    delay: this.pauseTime + 1000,
                    callback: () => {
                        this.startPlayerTurn();
                    }
                });
                
            } 
            else {
                this.setTextWithAnimation(this.infoText, "Anubis landed on a special position,\nhe has been blessed with another turn");
                console.log("Enemy landed on special position");
                this.time.addEvent({
                    delay: this.pauseTime + 1000,
                    callback: () => {
                        this.startEnemyTurn();
                    },
                });

            }


        });
        this.board.on('skipTurn', (piece) => {
            this.nextTurn();
        });
        this.board.on('pieceReachesEnd', (piece) => {
            console.log("Piece Reached End")
            this.pieceReachesEnd(piece);
        });
        this.board.on('pieceCaptured', (capturedPiece) => {
            if (capturedPiece.pieceType === PIECE_TYPE.PLAYER) {
                this.anyPieceCaptured = true;
                console.log("A player piece was captured. The player will not get the achievement.");
            }
        });

        // --- UI Elements ---  

        this.infoText = this.add.text(this.boardAnchor.x, this.boardAnchor.y -400, '', {fontSize: 55, fill: 0x000000ff, fontFamily: "Anubismythicalserif", align: 'center'}).setOrigin(0.5);

        this.eventsText = this.add.text(this.boardAnchor.x-675, this.boardAnchor.y, '', {fontSize: 35, fill: 0x000000ff, fontFamily: "Anubismythicalserif"}).setOrigin(0.5);

        /** @type {Phaser.GameObjects.Image} The image for the throw button. */
        this.throwBtnImage = this.add.image(0, 0, 'AsebButton').setScale(0.7);
        /** @type {Phaser.GameObjects.Text} The text for the throw button. */
        this.throwBtnText = this.add.text(0, 0, 'Throw', { fontSize: 68, fill: '#000000ff', fontFamily: "Anubismythicalserif"}).setOrigin(0.5);

        /** @type {Phaser.GameObjects.Container} The button for the player to throw the sticks. */
        this.throwBtn = this.add.container(this.boardAnchor.x, this.boardAnchor.y + 300, [ this.throwBtnImage, this.throwBtnText ]);
        this.throwBtn.setSize(this.throwBtnImage.width, this.throwBtnImage.height).setInteractive()
            .on('pointerover', () => {
                    this.tweens.add({
                        targets: this.throwBtn,
                        scale: 1.1,
                        duration: 100,
                        ease: 'Power1',
                    });
                
            })
            .on('pointerout', () => {
                    this.tweens.add({
                        targets: this.throwBtn,
                        scale: 1.0,
                        duration: 100,
                        ease: 'Power1',
                    });
            })
            .on('pointerdown', () => this.playerThrows());


        // --- Game Start ---

        // Start the first turn based on the result from the previous scene.
        if (this.playerFirst) {
            this.startPlayerTurn();
        } else {
            this.startEnemyTurn();
        }

    }

    /**
     * Manages the game loop, transitioning between player and enemy turns and checking for win/loss conditions.
     */
    nextTurn() {
        
        if (this.asebGame.state === GAME_STATE.PLAYER_TURN) { // if the actual state is the player turn, then it calls the enemy turn and viceversa.
            this.startEnemyTurn();
        } else if (this.asebGame.state === GAME_STATE.ENEMY_TURN) {
            this.startPlayerTurn();
        }
        if (this.asebGame.state === GAME_STATE.PLAYER_VICTORY) {

            if (!this.anyPieceCaptured) {

                this.playerData.AsebNoCapturesCompletion = true;
            }

            this.playerData.AsebLandedOnEverySpecial = this.board.checkLandedAllSpecialPositions();
            
            this.transitionController.startFadeOutTransition(() => {
                
                 this.scene.start('AsebVictoryScene', this.playerData);
            
            }, 400);
           

        } 
        else if (this.asebGame.state === GAME_STATE.ENEMY_VICTORY) {
           this.transitionController.startFadeOutTransition(() => {
                
                 this.scene.start('AsebDefeatScene', this.playerData);
            
            }, 400);

        }
    }

    /**
     * Sets up the game state for the player's turn and makes the placer pieces interactable.
     * 
     */
    startPlayerTurn() {
        this.asebGame.state = GAME_STATE.PLAYER_TURN;
        console.log(`Current state: ${this.asebGame.state}`);
        console.log("Starting player turn.");
        this.setTextWithAnimation(this.infoText, "Your turn. Throw the sticks!");
        this.throwBtnImage.setTexture('AsebButton');
        this.setObjectState(this.throwBtn, true);
        this.board.setPlayerPieceInteractable(false); // Can't move pieces before throwing.
    }

    /**
     * Handles the player's action of throwing the sticks.
     */
    playerThrows() 
    {
        if (!this.throwBtn.active) return; // Prevent action if button is inactive
        this.setObjectState(this.throwBtn, false);
        let ThrowResult = this.asebGame.getThrow();
        this.asebGame.player.actualStickResult = ThrowResult.Sum;

        if (this.asebGame.player.actualStickResult === 0) {
            this.setTextWithAnimation(this.infoText, "You got 0 points!\nYour turn is skipped.");
            this.board.setPlayerPieceInteractable(false);

            // Wait a moment before automatically advancing to the next turn
            this.time.addEvent({
                delay: this.pauseTime,
                callback: () => {
                    this.nextTurn();
                },
            });
        } else {
            // The player can make a move
            this.setTextWithAnimation(this.infoText, "You got " + this.asebGame.player.actualStickResult + " points");

            if (this.board.IsThereValidMoves(this.board.playerPieces, ThrowResult.Sum))
            {
                this.setTextWithAnimation(this.infoText, "You got " + this.asebGame.player.actualStickResult + " points\nClick on a piece to move it");
            }
            else{
                this.setTextWithAnimation(this.infoText, "You got " + this.asebGame.player.actualStickResult + " points\nBut you cannot move any piece");
                this.time.addEvent({
                delay: this.pauseTime,
                callback: () => {
                    this.nextTurn();
                },
            });
            }
            this.board.setPlayerPieceInteractable(true);
        }
    }
    
    /**
     * Manages the AI's (Anubis's) turn, including throwing sticks and moving a piece.
     */
    startEnemyTurn() 
    {
        this.asebGame.state = GAME_STATE.ENEMY_TURN;
        console.log(`Current state: ${this.asebGame.state}`);
        console.log("Starting enemy turn.");
        this.setObjectState(this.throwBtn, false);
        this.board.setPlayerPieceInteractable(false); // Player can't move pieces anymore.
        this.setTextWithAnimation(this.infoText, "Anubis's turn.");

        let ThrowResult = this.asebGame.getThrow();
        this.asebGame.enemy.actualStickResult = ThrowResult.Sum;

        this.time.addEvent({
            delay: this.pauseTime,
            callback: () => {
            //This method will iterate until anubis does a valid movement or there's no valid movement
            this.setTextWithAnimation(this.infoText, "Anubis got " + this.asebGame.enemy.actualStickResult + " points");
            this.board.doRandomMovement(ThrowResult.Sum);
            }

        });
    }
   
    /**
     * Handles the logic when a piece reaches the end of the board.
     * @param {AsebPiece} piece - The piece that reached the end.
     */
    pieceReachesEnd(piece)
    {
        this.asebGame.pieceReachedEnd(piece);
        this.setTextWithAnimation(this.infoText, "Piece Reached End");

        this.time.addEvent({
            delay: this.pauseTime,
            callback: () => {
                this.nextTurn();
            },
        
        });
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


    /**
     * A utility function to set the active and visible state of a game object.
     * @param {Phaser.GameObjects.GameObject} object - The game object to modify.
     * @param {boolean} state - The desired state (true for active/visible, false for inactive/invisible).
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
}
