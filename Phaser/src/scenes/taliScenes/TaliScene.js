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

    }

    preload() {
        let {width, height} = this.sys.game.canvas;
        this.width = width;
        this.height = height;
    }

    create(data) {
        if (data !== undefined) this.playerFirst = data.playerFirst;
        else this.playerFirst = true;

        this.state = this.playerFirst ? GAME_STATE.PLAYER_TURN : GAME_STATE.ENEMY_TURN;

        this.transitionController = new TransitionController(this);

        console.log(this.playerFirst ? "Player starts." : "Mercury starts.");

        this.addImages();
        this.taliGame = new Tali(this, this.width, this.height, this.playerFirst);

        this.currentTurn = 1;
        
        this.createButtons();
        this.addText();
        this.addEventListeners();

        this.transitionController.startFadeInTransition(1000, new RGBColor(0,0,0), () => this.startGame(this.playerFirst));
    }

    /**
     * Starts the game.
     */
    startGame(playerFirst) { 
        // Start the first turn.
        if (playerFirst) {
            this.startPlayerTurn();
        }
        else {
            this.startEnemyTurn(); 
        }
        this.rollBtn.setAlpha(1);
    }

    /**
     * Creates and places all the buttons for the scene.
     */
    createButtons() {
        this.rollBtn = this.add.text(this.width/2, 4*this.height/5, 'Roll', { fontSize: 80, fill: '#000', backgroundColor: '#fff'}).setOrigin(0.5)
        .setInteractive()
        .on('pointerover', () => this.rollBtn.setStyle({fill: 'rgba(116, 8, 9, 1)'}))
        .on('pointerout', () => this.rollBtn.setStyle({fill: '#000'}))
        .setAlpha(0);

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
        this.turnText = this.add.text(this.width/2, this.height/5, '', { fontSize: 64, fill: '#000'}).setOrigin(0.5);
        this.resultText = this.add.text(this.width/2, this.height - this.height/3, '', { fontSize: 64, fill: '#000'}).setOrigin(0.5);
    }

    addEventListeners() {
        this.events.on('turnEnded', () => {
            this.currentTurn++;
            this.nextTurn();
            this.updateScore();
        })
        this.taliGame.emitter.on('luna', () => { 
            this.nextTurn(); 
        });
        this.taliGame.emitter.on('diceIn', () => this.nextTurn());
        this.taliGame.emitter.on('throwIn', () => this.rollBtn.setAlpha(1));
    }

    /**
     * Establishes the next turn.
     */
    nextTurn() {
        console.log(this.taliGame.state);
        if (this.currentTurn <= Tali.TURNS * 2) {
            this.setObjectState(this.rollBtn, false);
            if (this.taliGame.state === GAME_STATE.PLAYER_TURN) {
                this.startEnemyTurn();
                console.log('enemy turn!')
            }
            else if (this.taliGame.state === GAME_STATE.ENEMY_TURN) {
                this.setObjectState(this.rollBtn, true);
                this.rollBtn.setText('Roll');       
                this.startPlayerTurn();
                console.log('player turn!')
            }
            else if (this.taliGame.state === GAME_STATE.PLAYER_ROLLING || this.taliGame.state === GAME_STATE.ENEMY_ROLLING) {
                this.showThrows();
                console.log('just rolled')
            }
            else if (this.taliGame.state === GAME_STATE.PLAYER_THROWING || this.taliGame.state === GAME_STATE.ENEMY_THROWING) {
                this.startNextTurn();
                console.log('just threw')
            }
            else if (this.taliGame.state === GAME_STATE.PLAYER_LUNA) {
                this.turnText.setText("LUNA! Roll again!");
                this.startPlayerTurn();
            }
            else if (this.taliGame.state === GAME_STATE.ENEMY_LUNA) {
                this.turnText.setText("LUNA! Mercury rolls again.");
                this.startEnemyTurn();
            }
        }
        else {
            this.gameEnded();
        }
    }

    startPlayerTurn() {
        this.taliGame.state = GAME_STATE.PLAYER_TURN;
        console.log("Starting player turn.");
        this.turnText.setText("Your turn! Roll the dice.");
        this.setObjectState(this.rollBtn, true);
        this.rollBtn.setText('Roll')
            .once('pointerdown', () => {
                this.taliGame.playerRoll();
                this.setObjectState(this.rollBtn, false);
            })
    }

    startEnemyTurn() {
        this.taliGame.state = GAME_STATE.ENEMY_TURN;
        console.log("Starting enemy turn.");
        this.turnText.setText("Mercury's turn! Mercury is rolling the dice.");
        this.setObjectState(this.rollBtn, false);
        this.taliGame.enemyRoll();
    }

    showThrows() {
        this.setObjectState(this.rollBtn, true);
        this.rollBtn.setText('Continue');       
        this.rollBtn.once('pointerdown', () => {
            this.taliGame.hideDice();
            this.setObjectState(this.rollBtn, false);
            this.rollBtn.setAlpha(0);
            this.taliGame.animateThrows();
            this.turnText.setText('Combinations:');
            this.nextTurn();
        })
    }

    startNextTurn() {
        this.setObjectState(this.rollBtn, true);
        this.rollBtn.once('pointerdown', () => {
            this.setObjectState(this.rollBtn, false);
            this.taliGame.hideThrows();
            if (this.taliGame.state === GAME_STATE.PLAYER_THROWING) {
                this.taliGame.state = GAME_STATE.PLAYER_TURN;
            }
            else if (this.taliGame.state === GAME_STATE.ENEMY_THROWING) {
                this.taliGame.state = GAME_STATE.ENEMY_TURN;
            }
            this.events.emit('turnEnded');
        })
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
        this.setObjectState(this.rollBtn, false);
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