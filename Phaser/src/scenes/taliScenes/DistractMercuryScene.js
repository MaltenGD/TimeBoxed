import { BaseScene } from '../BaseScene.js';
import DialogueController from '../../DialogueController.js';
import TransitionController, { RGBColor } from '../../misc/transitioncontroller.js';

/**
 * @class DistractMercuryScene
 * The scene which appears on top of the Tali Game scene.
 * In this scene, the player has the ability to influence the game by distracting drunk Mercury.
 */
export class DistractMercuryScene extends BaseScene {
    constructor() {
        super('DistractMercuryScene');
    }

    create(data) {
        this.playerData = data.playerData;
        // Sets the class variables width and height.
        let {width, height} = this.sys.game.canvas;
        this.width = width;
        this.height = height;

        // Creates transitin controller and fades in.
        this.transitionController = new TransitionController(this);
        // this.transitionController.startFadeInTransition(()=> {this.createAndBeginDialogue()}, 400, new RGBColor(0, 0, 0, 0.5));

        this.addImages();
        this.addButtons();
        this.createAndBeginDialogue();
        this.addListeners();
    }

    /**
     * Adds all necessary images to the scene.
     */
    addImages() {
        this.background = this.add.rectangle(0, 0, this.width, this.height, '0x000000', 0.5).setDisplaySize(this.width, this.height).setScale(2);
    }

    /**
     * Creates the necessary buttons for the scene.
    */
    addButtons() {
        this.optionOne = this.createButton(this.width / 2, this.height / 2, "Option1");
        this.optionTwo = this.createButton(this.width / 2, this.height / 2, "Option2");
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
     * Creates and begins the first dialogue block.
     */
    createAndBeginDialogue() {
        const dialogueData = this.cache.json.get('TaliDialogue');
        this.dialogueController = new DialogueController(this, "DistractMercury", dialogueData);
        this.dialogueController.iniDialogue();
    }

    /**
     * Adds all the listeners in this scene.
     */
    addListeners() {
        this.events.on('nextDialog', () => {
            this.displayOptions();
        })

        this.events.on('Finished', ()=> {
            // TODO
        })
    }

    /**
     * Shows the response options for the current dialogue.
     */
    displayOptions() {
        
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

}