import Tali, { GAME_STATE } from '../../tali/tali.js';
import { OptionMenuScene } from '../OptionMenuScene.js';
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

    preload() {
        let {width, height} = this.sys.game.canvas;
        this.width = width;
        this.height = height;
    }

    create(playerData) {

        this.playerData = playerData;
        console.log(this.playerData)

        this.playerFirst = this.playerData.TaliPlayerFirst
        
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

        this.input.keyboard.on('keydown-ESC', () => {
           this.openOptionMenu();
        });
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
        this.background = this.add.image(this.width / 2, this.height / 2, 'taliBackgroundPlaceholder').setDisplaySize(this.width, this.height);
        this.boardImg = this.add.image(this.width/2, this.height/2, 'taliBoard').setOrigin(0.5).setScale(0.5);
    }

    /**
     * Creates and places all the buttons for the scene.
     */
    createButtons() {
        this.rollBtn = this.createButton(this.width/2, 4*this.height/5, '', () => {});
        this.backBtn = this.add.text(0, 0, 'Back', { fontSize: 64, fill: '#000000ff'})
        .setInteractive()
        .on('pointerover', () => this.backBtn.setStyle({fill: 'rgba(104, 35, 35, 1)'}))
        .on('pointerout', () => this.backBtn.setStyle({fill: '#000000ff'}))
        .on('pointerdown', () => {
            this.openOptionMenu();
        });
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
     * Adds all the text to the scene.
     */
    addText() {
        this.enemyScoreText = this.add.text(this.width - 20, 20, "Mercury's Score: 0", {fontSize: 32}).setOrigin(1, 0);
        this.playerScoreText = this.add.text(20, this.height - 20, 'Your Score: 0', {fontSize: 32}).setOrigin(0, 1);
        this.turnText = this.add.text(this.width/2, this.height/5, '', { fontSize: 64, fill: '#000'}).setOrigin(0.5);
        this.resultText = this.add.text(this.width/2, this.height - this.height/3, '', { fontSize: 64, fill: '#000'}).setOrigin(0.5);
    }

    /**
     * Starts the game.
     */
    startGame() { 
        this.turnText.setText(this.playerFirst ? "Your turn! Roll the dice." : "Mercury starts!");
        this.taliGame.startGame();
    }

    /**
     * Registers all the existing events.
     */
    registerEvents() {
        this.taliGame.emitter.on('stateChange', (state) => {
            this.onStateChange(state);
        })
    }

    onStateChange(state) {
        console.log('State changed to: ' + state);

        switch (state) {
            case GAME_STATE.PLAYER_START:
                this.onPlayerTurn();
                break;
            case GAME_STATE.PLAYER_ROLLED:
                this.onPlayerRolled();
                break;
            case GAME_STATE.PLAYER_THROWN:
                this.onPlayerThrown();
                break;
            case GAME_STATE.ENEMY_START:
                this.onEnemyTurn();
                break;
            case GAME_STATE.ENEMY_ROLLED:
                this.onEnemyRolled();
                break;
            case GAME_STATE.ENEMY_THROWN:
                this.onEnemyThrown();
                break;
            case GAME_STATE.GAME_OVER:
                this.endGame();
                break;
        }
    }

    onPlayerTurn() {
        this.turnText.setText('Your turn!');
        this.resetButton(this.rollBtn, 'Roll', () => {
            this.setObjectState(this.rollBtn, false);
            this.taliGame.nextTurn();
            this.turnText.setText('Your rolls:');
        });
    }

    onPlayerRolled() {
        this.resetButton(this.rollBtn, 'Show combinations', () => {
            this.setObjectState(this.rollBtn, false);
            this.taliGame.nextTurn();
            this.turnText.setText('Your combinations:');
        })
    }

    onPlayerThrown() {
        this.resetButton(this.rollBtn, 'Done', () => {
            this.setObjectState(this.rollBtn, false);
            this.updateScore();
            this.taliGame.nextTurn();
        })
    }

    onEnemyTurn() {
        this.turnText.setText('Mercury is rolling...');
        this.resetButton(this.rollBtn, 'Reveal rolls', () => {
            this.setObjectState(this.rollBtn, false);
            this.taliGame.nextTurn();
            this.turnText.setText("Mercury's rolls:");
        })
    }

    onEnemyRolled() {
        this.resetButton(this.rollBtn, 'Show combinations', () => {
            this.setObjectState(this.rollBtn, false);
            this.turnText.setText("Mercury's combinations:");
            this.taliGame.nextTurn();
        })
    }

    onEnemyThrown() {
        this.resetButton(this.rollBtn, 'Done', () => {
            this.setObjectState(this.rollBtn, false);
            this.updateScore();
            this.taliGame.nextTurn();
        });
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
        this.playerData.TaliPlayerWon = this.taliGame.playerWon()
        this.scene.start('TaliEndScene', this.playerData);
    }
    openOptionMenu()
    {
        if (this.scene.isActive('OptionMenu')) return;
            this.scene.pause();
            this.playerData.SceneToResume = this.scene.key;
            this.scene.launch('OptionMenu', this.playerData);
    }   
}