import TransitionController, {RGBColor} from "../misc/transitioncontroller.js";

/**
 * @file PauseMenuScene.js
 * @description Scene to pause the game and show options to the player
 */
export class PauseMenuScene extends Phaser.Scene {
    constructor() {
        super('PauseMenu');
    }

    create() {
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
        this.titleText = this.add.text(width / 2, height / 2 - 80, 'Do you want to go back?', {
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
        this.yesBtn.on('pointerdown', () => {

        this.transitionController.startFadeOutTransition(800, new RGBColor(0,0,0), () => {

        if (this.sceneToPause) {
        this.scene.stop(this.sceneToPause);
        }
        this.scene.stop('PauseMenu');
        this.scene.start('SelectionMenuScene');
        })
        });

        this.noBtn.on('pointerdown', () => {
            this.scene.resume(this.sceneToPause);
            this.scene.stop('PauseMenu');
        });

        // this.tweens.add({
        //     targets: [this.box, this.titleText, this.yesBtn, this.noBtn],
        //     alpha: { from: 0, to: 1 },
        //     duration: 400,
        //     ease: 'Sine.easeInOut'
        // });
    }

    /**
     * Configure the name of the scene that is being paused
     */
    setPausedScene(sceneName) {
        this.sceneToPause = sceneName;
    }
}
