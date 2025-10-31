import AsebGame, { GAME_STATE } from '../../aseb/AsebGame.js';
import AsebBoard from '../../aseb/AsebBoard.js';



export class AsebScene extends Phaser.Scene {
        // Game states
        constructor() {
            super('AsebScene'); 
            this.debugMode = false;
        }


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
                y: height/2
            }
            
            this.loadImages();
        }

    /**
     * Loads all the aseb images.
     */
            
    loadImages() {
            this.load.image('asebBoard', 'Phaser/assets/aseb/AsebBoard.png');
            this.load.image('redPiece', 'Phaser/assets/aseb/redPiece.png');
            this.load.image('bluePiece', 'Phaser/assets/aseb/bluePiece.png');   
    }


    create(){
        console.log(this.playerFirst ? "Player starts the game." : "Anubis starts the game.");

        this.asebGame = new AsebGame(this, this.playerFirst);

        this.board = new AsebBoard(this,this.boardAnchor.x,this.boardAnchor.y,'asebBoard');

        
        this.board.on('pieceMoved', (piece) => {
            this.nextTurn();
        });
        this.board.on('skipTurn', (piece) => {
            this.nextTurn();
        });
        this.board.on('pieceReachesEnd', (piece) => {
            console.log("Piece Reached End")
            this.pieceReachesEnd(piece);
        });

        this.infoText = this.add.text(this.width/2, 100, '*', {fontSize: 55}).setOrigin(0.5);

        this.eventsText = this.add.text(200, this.height/2, '*', {fontSize: 35}).setOrigin(0.5);

        this.throwBtn = this.add.text(this.width/2 , this.height - 100, 'Throw', {fontSize: 55}).setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {

            this.playerThrows();
        }) 

        // Start the first turn based on the result from the previous scene.
        if (this.playerFirst) {
            this.startPlayerTurn();
        } else {
            this.startEnemyTurn();
        }
    }

    /**
     * Manages the game loop, transitioning between player and enemy turns.
     */
    nextTurn() {
        
        if (this.asebGame.state === GAME_STATE.PLAYER_TURN) { // if the actual state is the player turn, then it calls the enemy turn and viceversa.
            this.startEnemyTurn();
        } else if (this.asebGame.state === GAME_STATE.ENEMY_TURN) {
            this.startPlayerTurn();
        }
    }

    //This method is called when the game starts with the player as the first player or when the enemy has moved a piece
    startPlayerTurn() {
        this.asebGame.state = GAME_STATE.PLAYER_TURN;
        console.log(`Current state: ${this.asebGame.state}`);
        console.log("Starting player turn.");
        this.infoText.setText("Your turn. Throw the sticks!");
        this.setObjectState(this.throwBtn, true);
        this.board.setPlayerPieceInteractable(false); // Can't move pieces before throwing.
    }

    // This method is called when the Throw button is clicked
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
                delay: 1000,
                callback: () => {
                    this.nextTurn();
                },
            });
        } else {
            // The player can make a move
            this.infoText.setText("You threw " + this.asebGame.player.actualStickResult
                + "!\nClick on a piece to move it."
            );
            this.board.setPlayerPieceInteractable(true);
        }
    }
    
    // This method is responsible for the Machine behaviour
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
            delay: 2000,
            callback: () => {
            //This method will iterate until anubis does a valid movement or there's no valid movement
            this.board.doRandomMovement(ThrowResult.Sum);
            }

        });
    }


   


    pieceReachesEnd(piece)
    {
        this.asebGame.pieceReachedEnd(piece);
        this.eventsText.setText("Piece Reached End");

        this.time.addEvent({
            delay: 1500,
            callback: () => {
                this.eventsText.setText("*");
            },
        
        });
    }

    setObjectState(object,state)
    {
        object.setActive(state);
        object.setVisible(state);
    }
}
