import TransitionController, {RGBColor} from '../../misc/transitioncontroller.js';
import { OptionMenuScene } from '../OptionMenuScene.js';

/**
 * @class TaliEndScene
 * The scene for the end of the Tali game.
 */
export class TaliEndScene extends Phaser.Scene {
    constructor() {
        super('TaliEndScene');
    }

    preload() {
        let {width, height} = this.sys.game.canvas;
        this.width = width;
        this.height = height;
    }

    create(playerData) {

        this.playerData = playerData;
        console.log(this.playerData)

        this.playerWon = data?.playerWon ?? true;

        this.achManager = this.registry.get('AchievementManager');
        if (this.playerWon) {
            this.achManager.awardAchievement('TA1');
            console.log("TA1 awarded!");
        }
        this.registry.set('AchievementManager', this.achManager);
        
        this.transitionController = new TransitionController(this);
        
        this.createUI();

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
     * Opens the pause menu.
     */
    openPauseMenu() {
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
    }
    
    /**
     * Adds all the text to the scene.
     */
    addText() {
        this.victoryText = this.add.text(this.width/2, this.height/5, this.playerWon ? 'You won!' : 'You lost!', { fontSize: 64, fill: '#000'}).setOrigin(0.5);
    }
    openOptionMenu()
    {
        if (this.scene.isActive('OptionMenu')) return;
            this.scene.pause();
            this.playerData.SceneToResume = this.scene.key;
            this.scene.launch('OptionMenu', this.playerData);
    }
}