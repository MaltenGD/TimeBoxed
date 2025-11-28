import { BaseScene } from '../BaseScene.js';

/**
 * @class DistractMercuryScene
 * The scene which appears on top of the Tali Game scene.
 * In this scene, the player has the ability to influence the game by distracting drunk Mercury.
 */
export class DistractMercuryScene extends BaseScene {
    constructor() {
        super('DistractMercuryScene');

        // Sets the class variables width and height.
        let {width, height} = this.sys.game.canvas;
        this.width = width;
        this.height = height;
    }

    
    /**
     * Initializes scene data.
     * @param {object} data - Data passed from the previous scene.
     */
    init(playerData) {
        super.init(playerData);
    }

    create() {
        // Creates transitin controller and fades in.
        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition();

        this.background = this.add.image(width / 2, height / 2, 'taliBackgroundPlaceholder').setDisplaySize(width, height);
    }

}