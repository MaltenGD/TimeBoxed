import { BaseScene } from '../BaseScene.js';
import DialogueController from '../../DialogueController.js';

/**
 * @class DistractMercuryScene
 * The scene which appears on top of the Tali Game scene.
 * In this scene, the player has the ability to influence the game by distracting drunk Mercury.
 */
export class DistractMercuryScene extends BaseScene {
    constructor() {
        super('DistractMercuryScene');
    }
    
    /**
     * Initializes scene data.
     * @param {object} data - Data passed from the previous scene.
     */
    init(playerData) {
        super.init(playerData);

        // Sets the class variables width and height.
        let {width, height} = this.sys.game.canvas;
        this.width = width;
        this.height = height;
    }

    create() {
        // Creates transitin controller and fades in.
        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition();

        this.addImages();
        this.createButtons();
        this.createAndBeginDialogue();

        this.addListeners();
    }

    /**
     * Adds all necessary images to the scene.
     */
    addImages() {
        this.background = this.add.rectangle(0, 0, this.width, this.height, '0x000000', 128);
    }

    /**
     * Creates the necessary buttons for the scene.
    */
    createButtons() {

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