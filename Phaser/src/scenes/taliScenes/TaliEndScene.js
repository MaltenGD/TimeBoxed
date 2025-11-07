import TransitionController, {RGBColor} from '../../misc/transitioncontroller.js';

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

    create(data) {
        this.playerWon = data?.playerWon ?? true;
        
        this.transitionController = new TransitionController(this);
        
        this.createUI();
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
        this.backBtn = this.createButton(100, 50, 'Back', () => this.openPauseMenu(), {fontSize: 64, fill: '#fff'});
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
        this.victoryText = this.add.text(this.width/2, this.height/5, this.playerWon ? 'You won!' : 'You lost!', { fontSize: 64, fill: '#000'}).setOrigin(0.5);
    }
}