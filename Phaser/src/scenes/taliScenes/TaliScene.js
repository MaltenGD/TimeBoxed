import Tali, { GAME_STATE } from '../../tali/tali.js';
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

    currentTurn = 0;


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
    }

    create() {
        console.log(this.playerFirst ? "Player starts." : "Mercury starts.");

        this.addImages();
        this.taliGame = new Tali(this, this.width, this.height, this.playerFirst);

        this.currentTurn = 0;
        
        this.createButtons();
        this.addText();
        this.addEventListeners(); 
        
        // Start the first turn.
        if (this.playerFirst) {
            this.startPlayerTurn();
        }
        else {
            this.startEnemyTurn();
            
        }
    }

    /**
     * Creates and places all the buttons for the scene.
     */
    createButtons() {
        this.rollBtn = this.add.text(this.width/2, this.height/2, 'Roll!', { fontSize: 80, fill: '#000', backgroundColor: '#fff'}).setOrigin(0.5)
        .setInteractive()
        .on('pointerover', () => this.rollBtn.setStyle({fill: 'rgba(116, 8, 9, 1)'}))
        .on('pointerdown', () => {
            this.taliGame.playerRoll();
            this.setObjectState(this.rollBtn, false);
        })
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
        this.boardImg = this.add.image(this.width/2, this.height/2, 'taliBoard').setOrigin(0.5).setScale(0.6);
    }

    /**
     * Adds all the text to the scene.
     */
    addText() {
        this.enemyScore = this.add.text(this.width - 20, 20, 'Score: ' + this.taliGame.enemyScore).setOrigin(1, 0);
        this.playerScore = this.add.text(20, this.height - 20, 'My Score: ' + this.taliGame.playerScore).setOrigin(0, 1);
        this.turnText = this.add.text(this.width/2, this.height/3, '', { fontSize: 64, fill: '#000'}).setOrigin(0.5);
        this.resultText = this.add.text(this.width/2, this.height - this.height/3, '', { fontSize: 64, fill: '#000'}).setOrigin(0.5);
    }

    addEventListeners() {
        this.taliGame.emitter.on('turnEnded', () => {
            this.nextTurn();
        })
        this.taliGame.emitter.on('luna', () => this.lunaThrow());
    }

    startPlayerTurn() {
        this.taliGame.state = GAME_STATE.PLAYER_TURN;
        console.log("Starting player turn.");
        this.turnText.setText("Your turn! Roll the dice.");
        this.setObjectState(this.rollBtn, true);
    }

    startEnemyTurn() {
        this.taliGame.state = GAME_STATE.ENEMY_TURN;
        console.log("Starting enemy turn.");
        this.turnText.setText("Mercury's turn!");
        this.setObjectState(this.rollBtn, false);
        this.taliGame.enemyRoll();
    }

    /**
     * Establishes the next turn.
     */
    nextTurn() {
        if (this.taliGame.state === GAME_STATE.PLAYER_TURN) {
            this.startEnemyTurn();
        }
        else if (this.taliGame.state === GAME_STATE.ENEMY_TURN) {
            this.startPlayerTurn();
        }
    }

    lunaThrow() {
        if (this.taliGame.state === GAME_STATE.PLAYER_TURN) {
            this.turnText.setText("LUNA! Roll again!");
            this.startPlayerTurn();
        }
        else if (this.taliGame.state === GAME_STATE.ENEMY_TURN) {
            this.turnText.setText("LUNA! Mercury rolls again.");
            this.startEnemyTurn();
        }
    }

    /**
     * Changes visibility and state of an object.
     * @param object The object to change the state of.
     * @param {boolean} state The state.
     */
    setObjectState(object,state)
    {
        object.setActive(state);
        object.setVisible(state);
    }

}