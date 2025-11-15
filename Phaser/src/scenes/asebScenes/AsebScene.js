import AsebGame, { GAME_STATE } from '../../aseb/AsebGame.js';
import AsebBoard from '../../aseb/AsebBoard.js';
import { OptionMenuScene } from '../OptionMenuScene.js';
import { PIECE_TYPE } from '../../aseb/AsebPiece.js';



/**
 * @class AsebScene
 * @description The main scene for the actual Aseb game.
 * This scene manages the game flow, and the board events.
 */
export class AsebScene extends Phaser.Scene {
        constructor() {
            super('AsebScene'); 
            this.debugMode = false;
        }

        /**
         * Initializes scene data.
         * @param {object} data - Data passed from the previous scene.
         * @param {boolean} [data.playerFirst=true] - Determines if the player takes the first turn.
         */
        init(data) {
            // Default to player going first if no data is passed.
            if (data !== undefined) this.playerFirst = data.playerFirst
            else this.playerFirst = true;
        }

        preload() {
            let {width, height} = this.sys.game.canvas;
            this.width = width;
            this.height = height;

            this.boardAnchor = {
                x: width/2,
                y: height/2 + 50
            }
            
        }


    /*
     * Creates the game objects and sets up the scene.
     */
    create(){

        this.background = this.add.image(this.width / 2, this.height / 2, 'asebBackgroundPlaceholder').setDisplaySize(this.width, this.height);
        this.infoBoard = this.add.image(this.width/2, this.height/2, 'StickBoard').setOrigin(0.5).setScale(0.55);

        this.input.keyboard.on('keydown-ESC', () => {
            if (this.scene.isActive('OptionMenu')) return;
            this.scene.pause();
            this.scene.launch('OptionMenu', { sceneToPause: this.scene.key });
        });

        this.backBtn = this.add.text(0, 0, 'Back', { fontSize: 64, fill: '#000000ff'})
        .setInteractive()
        .on('pointerover', () => this.backBtn.setStyle({fill: '#0f0'}))
        .on('pointerout', () => this.backBtn.setStyle({fill: '#000000ff'}))
        .on('pointerdown', () => {
            if (this.scene.isActive('ConfirmMenu')) return;
    
            this.scene.pause();
            this.scene.launch('ConfirmMenu', {
                text: 'Do you want to go back to the menu?',
                sceneToPause: this.scene.key,
                onYes: () => {
                    this.scene.stop(this.scene.key);
                    this.scene.stop('ConfirmMenu');
                    this.scene.start('SelectionMenuScene');
                },
                onNo: () => {
                    this.scene.resume(this.scene.key);
                    this.scene.stop('ConfirmMenu');
                }
            });
        });
        
        this.winBtn = this.add.text(0, 70, 'Win Game', { fontSize: 64, fill: '#000000ff'})
        .setInteractive()
        .on('pointerover', () => this.winBtn.setStyle({fill: '#0f0'}))
        .on('pointerout', () => this.winBtn.setStyle({fill: '#000000ff'}))
        .on('pointerdown', () => {
            this.scene.start('AsebVictoryScene');
        });

        this.loseBtn = this.add.text(350, 70, 'Lose Game', { fontSize: 64, fill: '#000000ff'})
        .setInteractive()
        .on('pointerover', () => this.loseBtn.setStyle({fill: '#f00'}))
        .on('pointerout', () => this.loseBtn.setStyle({fill: '#000000ff'}))
        .on('pointerdown', () => {
            this.scene.start('AsebDefeatScene');
        });

        console.log(this.playerFirst ? "Player starts the game." : "Anubis starts the game.");

        this.asebGame = new AsebGame(this, this.playerFirst);

        this.board = new AsebBoard(this,this.boardAnchor.x,this.boardAnchor.y,'asebBoard');

        /** @type {number} The pause time in milliseconds for showing information to the player. */
        this.pauseTime = 1000        // 1000 miliseconds

        // --- Board Event Listeners ---

        this.board.on('pieceMoved', (piece) => {
            this.nextTurn();
        });
        this.board.on('SpecialPosition', (pieceType) => { // If any
            
            if (pieceType === PIECE_TYPE.PLAYER) {

                this.infoText.setText("You Landed on a special position,\nyou've been blessed with another turn")
                this.time.addEvent({
                    delay: this.pauseTime + 1000,
                    callback: () => {
                        this.startPlayerTurn();
                    },
                });
                
            } 
            else {
                this.infoText.setText("Anubis Landed on a special position,\nHe has been blessed with another turn")
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

        // --- UI Elements ---  

        this.infoText = this.add.text(this.boardAnchor.x, this.boardAnchor.y -400, '*', {fontSize: 55, fill: 0x000000ff}).setOrigin(0.5);

        this.eventsText = this.add.text(this.boardAnchor.x-675, this.boardAnchor.y, '*', {fontSize: 35}).setOrigin(0.5);

        /** @type {Phaser.GameObjects.Text} The button for the player to throw the sticks. */
        this.throwBtn = this.add.text(this.boardAnchor.x, this.boardAnchor.y +300, 'Throw', {fontSize: 55, fill:0x000000ff}).setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {

            this.playerThrows();
        }) 

        // --- Game Start ---

        // Start the first turn based on the result from the previous scene.
        if (this.playerFirst) {
            this.startPlayerTurn();
        } else {
            this.startEnemyTurn();
        }

        this.input.keyboard.on('keydown-ESC', () => {
            if (this.scene.isActive('OptionMenu')) return;
            this.scene.pause();
            this.scene.launch('OptionMenu', { sceneToPause: this.scene.key });
        });
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
            this.scene.start('AsebVictoryScene');

        } 
        else if (this.asebGame.state === GAME_STATE.ENEMY_VICTORY) {
            this.scene.start('AsebDefeatScene');

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
        this.infoText.setText("Your turn. Throw the sticks!");
        this.setObjectState(this.throwBtn, true);
        this.board.setPlayerPieceInteractable(false); // Can't move pieces before throwing.
    }

    /**
     * Handles the player's action of throwing the sticks.
     */
    playerThrows() 
    {
        this.setObjectState(this.throwBtn, false);
        let ThrowResult = this.asebGame.getThrow();
        this.asebGame.player.actualStickResult = ThrowResult.Sum;

        if (this.asebGame.player.actualStickResult === 0) {
            this.infoText.setText("You threw a 0!\nYour turn is skipped.");
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
            this.infoText.setText("You threw " + this.asebGame.player.actualStickResult);

            if (this.board.IsThereValidMoves(this.board.playerPieces, ThrowResult.Sum))
            {
                this.infoText.setText("You threw " + this.asebGame.player.actualStickResult + "\nClick on a piece to move it");
            }
            else{
                this.infoText.setText("You threw " + this.asebGame.player.actualStickResult + "\nBut you cannot move any piece");
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
        this.infoText.setText("Anubis's turn.");

        let ThrowResult = this.asebGame.getThrow();
        this.asebGame.enemy.actualStickResult = ThrowResult.Sum;

        this.time.addEvent({
            delay: this.pauseTime,
            callback: () => {
            //This method will iterate until anubis does a valid movement or there's no valid movement
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
        this.eventsText.setText("Piece Reached End");

        this.time.addEvent({
            delay: this.pauseTime,
            callback: () => {
                this.eventsText.setText("*");
            },
        
        });
    }

    /**
     * A utility function to set the active and visible state of a game object.
     * @param {Phaser.GameObjects.GameObject} object - The game object to modify.
     * @param {boolean} state - The desired state (true for active/visible, false for inactive/invisible).
     */
    setObjectState(object,state)
    {
        object.setActive(state);
        object.setVisible(state);
    }
}
