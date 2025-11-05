import Tali, { GAME_STATE } from '../../tali/tali.js';
import TransitionController, {RGBColor} from '../../misc/transitioncontroller.js';
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
    playerWon = true;

    currentTurn = 0;

    constructor() {
        super('TaliScene');
    }

    init(data) {
        if (data !== undefined) this.playerFirst = data.playerFirst;
        else this.playerFirst = true;

        this.state = this.playerFirst ? GAME_STATE.PLAYER_TURN : GAME_STATE.ENEMY_TURN;
    }

    preload() {
        let {width, height} = this.sys.game.canvas;
        this.width = width;
        this.height = height;
    }

    create() {
        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition();
        console.log('starting transition');
        this.transitionController.emitter.once('fadeInComplete', () => this.startGame());
    }

    startGame() {
        console.log(this.playerFirst ? "Player starts." : "Mercury starts.");

        this.addImages();
        this.taliGame = new Tali(this, this.width, this.height, this.playerFirst);

        this.currentTurn = 1;
        
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
        this.rollBtn = this.add.text(this.width/2, 2*this.height/3, 'Roll!', { fontSize: 80, fill: '#000', backgroundColor: '#fff'}).setOrigin(0.5)
        .setInteractive()
        .on('pointerover', () => this.rollBtn.setStyle({fill: 'rgba(116, 8, 9, 1)'}))
        .on('pointerdown', () => {
            this.nextTurn();
            this.setObjectState(this.rollBtn, false);
        })
        .on('pointerout', () => this.rollBtn.setStyle({fill: '#000'}));

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

    /**
     * Adds all the text to the scene.
     */
    addText() {
        this.enemyScore = this.add.text(this.width - 20, 20, "Mercury's Score: " + this.taliGame.playerScore, {fontSize: 32}).setOrigin(1, 0);
        this.playerScore = this.add.text(20, this.height - 20, 'Your Score: ' + this.taliGame.enemyScore, {fontSize: 32}).setOrigin(0, 1);
        this.turnText = this.add.text(this.width/2, this.height/3, '', { fontSize: 64, fill: '#000'}).setOrigin(0.5);
        this.resultText = this.add.text(this.width/2, this.height - this.height/3, '', { fontSize: 64, fill: '#000'}).setOrigin(0.5);
    }

    addEventListeners() {
        this.taliGame.emitter.on('turnEnded', () => {
            this.currentTurn++;
            this.setObjectState(this.rollBtn, true)
            this.rollBtn.setText('Continue')
            .on('pointerdown', () => {
                if (this.currentTurn <= Tali.TURNS * 2)
                    this.nextTurn();
                else {
                    this.gameEnded();
                }
            })
            this.updateScore();
        })
        this.taliGame.emitter.on('luna', () => this.lunaThrow());
    }

    startPlayerTurn() {
        this.taliGame.state = GAME_STATE.PLAYER_TURN;
        console.log("Starting player turn.");
        this.turnText.setText("Your turn! Roll the dice.");
        this.setObjectState(this.rollBtn, true);
        this.rollBtn.on('pointerdown', () => {
            this.taliGame.playerRoll();
        })
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

    updateScore() {
        this.playerScore.setText('Your Score: ' + this.taliGame.playerScore);
        this.enemyScore.setText("Mercury's Score: " + this.taliGame.enemyScore);
    }

    /**
     * Ends the game and announces the winner.
     */
    gameEnded() {
        this.playerWon = this.taliGame.playerWon();
        let winText = this.playerWon ? "YOU!" : "MERCURY!";
        this.turnText.setText('GAME ENDED! WINNER: ' + winText);
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