import TransitionController, {RGBColor} from "../misc/transitioncontroller.js";

/**
 * @file ConfirmMenuScene.js
 * @description Scene to pause the game and show options to the player
 */
export class ConfirmMenuScene extends Phaser.Scene {
    constructor() {
        super('ConfirmMenu');
    }

    /**
     * Creates the scene.
     * @param {object} data - The data object passed from the calling scene.
     * @param {string} [data.text='Do you want to go back?'] - The text to display in the menu.
     * @param {function} data.onYes - The function to call when the 'Yes' button is pressed.
     * @param {function} data.onNo - The function to call when the 'No' button is pressed.
     * @param {string} [data.PausedScene] - The key of the scene that is being paused.
     */
    create(data) {
        const { width, height } = this.scale;
        this.transitionController = new TransitionController(this);

        /**
         * Background
         */
        this.overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6)
            .setOrigin(0.5);

        /**
         * Central box
         */
        this.box = this.add.rectangle(width / 2, height / 2, 700, 500, 0x111111, 1)
            .setStrokeStyle(4, 0xAA0000)
            .setOrigin(0.5);
        
        /**
         * Text
         */
        const titleText = (data && data.text) ? data.text : 'Do you want to go back?';
        this.sceneToPause = data ? data.PausedScene : undefined;

        this.titleText = this.add.text(width / 2, height / 2 - 80, titleText, {
            fontSize: '34px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        /**
         * Yes botton
         */
        this.yesBtn = this.add.text(width / 2 - 100, height / 2 + 60, 'Yes', {
            fontSize: '30px',
            fill: '#fff',
            backgroundColor: '#8B0000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        /**
         * No botton
         */
        this.noBtn = this.add.text(width / 2 + 100, height / 2 + 60, 'No', {
            fontSize: '30px',
            fill: '#fff',
            backgroundColor: '#107310',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        /**
         * Evets of the bottons
         */
        this.yesBtn.on('pointerdown', (data && data.onYes) ? data.onYes : () => {
            this.transitionController.startFadeOutTransition(800, new RGBColor(0,0,0), () => {
                if (this.sceneToPause) {
                    this.scene.stop(this.sceneToPause);
                }
                this.scene.stop('ConfirmMenu');
                this.scene.start('SelectionMenuScene');
            });
        });

        this.noBtn.on('pointerdown', (data && data.onNo) ? data.onNo : () => {
            this.closeMenu();
        });

        const onNoCallback = (data && data.onNo) ? data.onNo : () => this.closeMenu();
        this.input.keyboard.once('keydown-ESC', () => {
            onNoCallback();
        });

        // this.tweens.add({
        //     targets: [this.box, this.titleText, this.yesBtn, this.noBtn],
        //     alpha: { from: 0, to: 1 },
        //     duration: 400,
        //     ease: 'Sine.easeInOut'
        // });
        
    }


    /** Default behaviour when clicking No or pressing ESCAPE */
    closeMenu() {
        if (this.sceneToPause) {
                this.scene.resume(this.sceneToPause);
            }
            this.scene.stop('ConfirmMenu');
        }

    /**
     * Configure the name of the scene that is being paused
     */
    setPausedScene(sceneName) {
        this.sceneToPause = sceneName;
    }
}
