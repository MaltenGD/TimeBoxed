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
        this.playerFirst = data?.playerFirst ?? true;

        this.transitionController = new TransitionController(this);

        console.log(this.playerFirst ? "Player starts." : "Mercury starts.");

        this.taliGame = new Tali(this, this.width, this.height, this.playerFirst);

        this.currentTurn = 1;
        
        this.createUI();
        this.registerEvents();

        this.transitionController.startFadeInTransition(
            1000, 
            new RGBColor(0,0,0), 
            () => this.startGame());
    }

    createUI() {
        this.addImages();
        this.createButtons();
        this.addText();
    }

    /**
     * Adds all the images to the scene.
     */
    addImages() {
        this.boardImg = this.add.image(this.width/2, this.height/2, 'taliBoard').setOrigin(0.5).setScale(0.5);
    }

    /**
     * Creates and places all the buttons for the scene.
     */
    createButtons() {
        this.rollBtn = this.createButton(this.width/2, 2*this.height/3, '', () => {});
        this.backBtn = this.createButton(100, 50, 'Back', () => this.openPauseMenu(), {fontSize: 64});
    }

    /**
     * Creates a button with the given specifications.
     * @param {number} x X position
     * @param {number} y Y position
     * @param {string} label The text inside the button
     * @param {() => void} [onClick=() => {}] The event run on click
     * @param {*} style The style (fontSize, fill...)
     * @param {*} pointeroverStyle Style when hovering over the button
     * @returns 
     */
    createButton(x, y, label, onClick = () => {}, style = {backgroundColor: '#fff', fill: '#000', fontSize: 80}, pointeroverStyle = {fill: 'rgba(116, 8, 9, 1)'}) {
        const btn = this.add.text(x, y, label, {
            fontSize: style.fontSize,
            fill: style.fill,
            backgroundColor: style.backgroundColor
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerover', () => btn.setStyle({ fill: pointeroverStyle.fill }))
        .on('pointerout', () => btn.setStyle({ fill: style.fill }))
        .on('pointerdown', onClick);

        return btn;
    }

    /**
     * Removes the listeners and resets the text of the given button.
     * @param {button} btn the button to reset
     * @param {string} label the new text
     * @param {*} onClick the new event on click
     */
    resetButton(btn, label, onClick) {
        btn.removeAllListeners('pointerdown')
            .setText(label)
            .setInteractive()
            .once('pointerdown', onClick);
        this.setObjectState(btn, true);
    }

    /**
     * Changes visibility and state of an object.
     * @param object The object to change the state of.
     * @param {boolean} state The state.
     */
    setObjectState(object, state)
    {
        object.setVisible(state).setActive(state).setAlpha(state ? 1 : 0);
    }

    /**
     * Opens the pause menu.
     */
    openPauseMenu() {
        if (this.scene.isActive('PauseMenu')) return;
        this.scene.launch('PauseMenu');
        const pauseMenu = this.scene.get('PauseMenu');
        pauseMenu.setPausedScene(this.scene.key);
        this.scene.pause();
    }
    
    /**
     * Adds all the text to the scene.
     */
    addText() {
        this.enemyScoreText = this.add.text(this.width - 20, 20, "Mercury's Score: 0", {fontSize: 32}).setOrigin(1, 0);
        this.playerScoreText = this.add.text(20, this.height - 20, 'Your Score: 0', {fontSize: 32}).setOrigin(0, 1);
        this.turnText = this.add.text(this.width/2, this.height/3, '', { fontSize: 64, fill: '#000'}).setOrigin(0.5);
        this.resultText = this.add.text(this.width/2, this.height - this.height/3, '', { fontSize: 64, fill: '#000'}).setOrigin(0.5);
    }

    /**
     * Starts the game.
     */
    startGame() { 
        this.turnText.setText(this.playerFirst ? "Your turn! Roll the dice." : "Mercury starts!");
        this.taliGame.startGame();
        this.updateState();
    }

    /**
     * Updates the roll button depending on the state:
     * Player's turn: shows roll and waits for player to click to roll
     * Enemy state: hides button and enemy rolls
     */
    updateState() {
        const state = this.taliGame.state;

        switch (state) {
            case GAME_STATE.PLAYER_TURN:
                this.resetButton(this.rollBtn, 'Roll', () => {
                    this.setObjectState(this.rollBtn, false);
                    this.taliGame.playerRoll();
                });
                break;
            case GAME_STATE.PLAYER_ROLLING:
                this.resetButton('')
                break;
            
            case GAME_STATE.ENEMY_TURN:
                this.setObjectState(this.rollBtn, false);
                this.turnText.setText("Mercury is rolling...");
                this.taliGame.enemyRoll();
                break;
            default:
                this.setObjectState(this.rollBtn, false);
        }
    }

    /**
     * Registers all the existing events.
     */
    registerEvents() {
        const game = this.taliGame;

        game.emitter.on('stateChange', (state) => {
            console.log('State changed to: ', state);
        })

        // Dice events
        game.emitter.on('diceIn', () => this.onDiceShown());
        game.emitter.on('throwsIn', () => this.onThrowsShown());
        game.emitter.on('luna', () => this.onLuna());

        // End of turn
        this.events.on('turnEnded', () =>
        {
            this.updateScore();
            this.currentTurn++;
            if (this.currentTurn > Tali.TURNS) this.endGame();
            else this.nextTurn();
        })
    }

    onDiceShown() {
        this.resetButton(this.rollBtn, 'Continue', () => {
            this.taliGame.hideDice();
            this.taliGame.animateThrows();
            this.turnText.setText('Combinations: ');
        });
    }

    onThrowsShown() {
        this.resetButton(this.rollBtn, 'Continue', () => {
            this.taliGame.hideThrows();
            this.events.emit('turnEnded');
        });
    }

    onLuna() {
        this.turnText.setText('LUNA! Roll again!');
        this.updateState();
    }

    /**
     * Plays the next turn.
     */
    nextTurn() {
        if (this.taliGame.state === GAME_STATE.PLAYER_TURN) {
            this.taliGame.state = GAME_STATE.ENEMY_TURN;
        } else {
            this.taliGame.state = GAME_STATE.PLAYER_TURN;
        }
        this.updateState();
    }

    /**
     * Updates scores on the screen.
     */
    updateScore() {
        this.playerScoreText.setText('Your Score: ' + this.taliGame.playerScore);
        this.enemyScoreText.setText("Mercury's Score: " + this.taliGame.enemyScore);
    }

    /**
     * Ends the game and announces the winner.
     */
    endGame() {
        const playerWon = this.taliGame.playerWon();
        this.turnText.setText(`Game Over! Winner: ${playerWon ? 'YOU' : 'MERCURY'}`);
        this.setObjectState(this.rollBtn, false);
    }

}