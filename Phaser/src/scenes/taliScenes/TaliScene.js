import Tali, { GAME_STATE } from '../../tali/tali.js';
import { OptionMenuScene } from '../OptionMenuScene.js';
import TransitionController, {RGBColor} from '../../misc/transitioncontroller.js';
import { BaseScene } from '../BaseScene.js';

/**
 * @class TaliScene
 * The scene for the Tali game (Rome).
 */
export class TaliScene extends BaseScene {
    turnText;
    resultText;
    
    enemyScore;
    playerScore;

    currentRoll = [0, 0, 0, 0];

    playerFirst;
    playerWon = true;

    constructor() {
        super('TaliScene');
    }

    preload() {
        let {width, height} = this.sys.game.canvas;
        this.width = width;
        this.height = height;
    }

    async create(playerData) {
        this.playerData = playerData;
        console.log(this.playerData)

        // Wait for the custom font to be loaded before creating any text
        // The font size here doesn't matter, it just ensures the font family is ready.
        await document.fonts.load('64px TaliOne');

        this.playerFirst = this.playerData.TaliPlayerFirst;
        
        this.transitionController = new TransitionController(this);

        console.log(this.playerFirst ? "Player starts." : "Mercury starts.");

        this.taliGame = new Tali(this, this.width, this.height, this.playerFirst);
        
        this.createUI();
        this.registerEvents();

        this.transitionController.startFadeInTransition(() => this.startGame());

        // Possible dialogue indexes
        this.possibleDialogues = [0, 1, 2, 3, 4];
    }

    /**
     * Creates the UI
     */
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
        this.boardImg = this.add.image(this.width/2, this.height/2, 'taliBoard').setOrigin(0.5).setScale(0.45);
    }

    /**
     * Creates and places all the buttons for the scene.
     */
    createButtons() {
        this.rollBtn = this.createButton(this.width/2, 4*this.height/5, '', ()=>{});
        this.backBtn = this.add.text(10, 10, 'Back', {fontSize: 50, fill: '#fff', fontFamily: 'TaliOne'})
        .setInteractive()
        .on('pointerover', () => this.tweens.add({targets: this.backBtn, scale: 1.1, duration: 100, ease: 'Power1'}))
        .on('pointerout', () => this.tweens.add({targets: this.backBtn, scale: 1, duration: 100, ease: 'Power1'}))
        .on('pointerdown', () => this.openOptionMenu());
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
    createButton(x, y, label, onClick = () => {}, style = {fill: '#fff', fontSize: 100, fontFamily: 'TaliOne'}, pointeroverStyle = {fill: 'rgba(116, 8, 9, 1)'}) {
        const btnImg = this.add.image(0, 0, 'taliButton');
        const btn = this.add.text(0, 0, label, {
            fontSize: style.fontSize,
            fill: style.fill,
            fontFamily: style.fontFamily
        })
        .setOrigin(0.5)

        const button = this.add.container(x, y, [ btnImg, btn ])
        button.setSize(btnImg.width, btnImg.height)
        button.setInteractive()
        .setScale(0.5)
        .on('pointerover', () => this.tweens.add({ targets: button, scale: 0.6, duration: 100, ease: 'Power1' }))
        .on('pointerout', () => this.tweens.add({ targets: button, scale: 0.5, duration: 100, ease: 'Power1' }))
        .on('pointerdown', onClick);

        return button;
    }

    /**
     * Removes the listeners and resets the text of the given button.
     * @param {button} btn the button to reset
     * @param {string} label the new text
     * @param {*} onClick the new event on click
     */
    resetButton(btn, label, onClick) {
        this.setObjectState(btn, true);
        btn.removeAllListeners('pointerdown')
        btn.list[1].setText(label)
        btn.setInteractive()
        .once('pointerdown', onClick);
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
        this.enemyScoreText = this.add.text(this.width - 20, 20, "Mercury's Score: 0", {fontSize: 60, fontFamily: 'TaliOne'}).setOrigin(1, 0);
        this.playerScoreText = this.add.text(20, this.height - 20, 'Your Score: 0', {fontSize: 60, fontFamily: 'TaliOne'}).setOrigin(0, 1);
        this.turnText = this.add.text(this.width/2, this.height/5, '', { fontSize: 80, fill: '#fff', fontFamily: 'TaliOne'}).setOrigin(0.5);
        this.resultText = this.add.text(this.width/2, this.height - this.height/3, '', { fontSize: 80, fill: '#fff', fontFamily: 'TaliOne'}).setOrigin(0.5);
    }

    /**
     * Sets the text with an animation and plays a sound.
     * @param {Text} textObject the text object to change.
     * @param {string} newText the new text to set.
     * @param {number} AnimDuration the duration of the animation
     */
    setTextWithAnimation(textObject, newText, AnimDuration = 100)
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
     * Starts the game.
     */
    startGame() { 
        this.setTextWithAnimation(this.turnText, this.playerFirst ? "Your turn! Roll the dice." : "Mercury starts!");
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

        // TODO: make mercury's rolls show without having to press a button

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
            case GAME_STATE.ENEMY_DISTRACT:
                this.onEnemyDistract();
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
        this.setTextWithAnimation(this.turnText, "Your turn!");
        console.log("reset button");
        this.resetButton(this.rollBtn, 'Roll', () => {
            console.log("rolll");
            this.setObjectState(this.rollBtn, false);
            this.taliGame.nextTurn();
            this.setTextWithAnimation(this.turnText, "Your rolls:");
        });
    }

    onPlayerRolled() {
        this.resetButton(this.rollBtn, 'Show combinations', () => {
            this.setObjectState(this.rollBtn, false);
            this.taliGame.nextTurn();
            this.setTextWithAnimation(this.turnText, "Your combinations:");
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
        this.setTextWithAnimation(this.turnText, "Mercury is rolling...")
        this.resetButton(this.rollBtn, 'Reveal rolls', () => {
            this.setObjectState(this.rollBtn, false);
            this.taliGame.nextTurn();
            this.setTextWithAnimation(this.turnText, "Mercury's rolls:");
        })
    }

    onEnemyRolled() {

        this.resetButton(this.rollBtn, 'Distract Mercury!', () => {
            this.setObjectState(this.rollBtn, false);
            this.taliGame.nextTurn();
            this.setTextWithAnimation(this.turnText, "");
        })
    }

    onEnemyDistract() {
        this.scene.pause();
        this.scene.launch('DistractMercuryScene', {playerData: this.playerData, mercuryRoll: this.taliGame.currentRoll, possibleDialogues: this.possibleDialogues});
        this.events.once("resume", (scene, data) => {
            this.taliGame.currentRoll = data.mercuryResultRoll;
            this.possibleDialogues = data.possibleDialogues;
            this.taliGame.setDiceImages();
            console.log("Resumed game.");
            this.resetButton(this.rollBtn, 'Show combinations', () => {
                this.setObjectState(this.rollBtn, false);
                this.setTextWithAnimation(this.turnText, "Mercury's combinations:");
                this.taliGame.nextTurn();
            })    
        });
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
        this.playerData.TaliCompleted = this.taliGame.playerWon()
        this.scene.start('TaliEndScene', this.playerData);
    }
}