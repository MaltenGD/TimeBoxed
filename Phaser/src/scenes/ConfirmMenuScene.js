import TransitionController, {RGBColor} from "../misc/transitioncontroller.js";
import { BaseScene } from "./BaseScene.js";
/**
 * @file ConfirmMenuScene.js
 * @description Scene to pause the game and show options to the player
 */
export class ConfirmMenuScene extends BaseScene {
    constructor() {
        super('ConfirmMenu');
    }

    /**
     * Creates the scene.
     * @param {object} data - The data object passed from the calling scene.
     * @param {string} [data.text='Do you want to go back?'] - The text to display in the menu.
     * @param {function} data.onYes - The function to call when the 'Yes' button is pressed.
     * @param {function} data.onNo - The function to call when the 'No' button is pressed.
     * @param {function} [data.onHoverYes] - The function to call when the pointer hovers over the 'Yes' button.
     * @param {function} [data.onHoverNo] - The function to call when the pointer hovers over the 'No' button.
     * @param {string} [data.yesText='Yes'] - The text for the 'Yes' (left) button.
     * @param {string} [data.noText='No'] - The text for the 'No' (right) button.
     * @param {string} [data.PausedScene] - The key of the scene that is being paused.
     */
    create(data) {
        const { width, height } = this.scale;
        this.transitionController = new TransitionController(this);

        this.DisableOptionMenu();

        this.playerData = data.playerData;

        /**
         * Background
         */
        this.overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6)
            .setOrigin(0.5);

        /**
         * Central box
         */
        const strokeColor = this.playerData.TimeboxedMode ? 0xAA0000 : 0x0055CC;
        this.box = this.add.rectangle(width / 2, height / 2, 800, 500, 0x111111, 1)
            .setStrokeStyle(4, strokeColor)
            .setOrigin(0.5);
        
        /**
         * Text
         */
        const titleText = (data && data.text) ? data.text : 'Do you want to go back?';
        this.sceneToPause = data ? data.PausedScene : undefined;

        // Ensure the title text stays inside the central box with padding and wraps if necessary
        const padding = 40;
        const maxTextWidth = this.box.width - padding * 2;
        const maxTextHeight = this.box.height; // leave space for buttons etc.

        this.titleText = this.add.text(width / 2, height / 2 - 100, titleText, {
            fontSize: '34px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: maxTextWidth, useAdvancedWrap: true }
        }).setOrigin(0.5);

        // If the wrapped text is still taller than the available area, reduce font size to fit
        if (this.titleText.height > maxTextHeight) {
            const baseSize = 34;
            const scale = maxTextHeight / this.titleText.height;
            const newSize = Math.max(14, Math.floor(baseSize * scale)); // don't go below 14px
            this.titleText.setStyle({ fontSize: newSize + 'px', wordWrap: { width: maxTextWidth, useAdvancedWrap: true } });
            this.titleText.setOrigin(0.5);
        }

        /**
         * Yes botton
         */
        const yesButtonText = (data && data.yesText) ? data.yesText : 'Yes';
        this.yesBtn = this.add.text(width / 2 - 100, height / 2 + 120, yesButtonText, {
            fontSize: '30px',
            fill: '#fff',
            backgroundColor: '#8B0000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive()
        .on('pointerout', () => {
            this.tweens.add({
                targets: this.yesBtn,
                scale: 1.0,
                duration: 100,
                ease: 'Power1',
            });
        });

        /**
         * No botton
         */
        const noButtonText = (data && data.noText) ? data.noText : 'No';
        this.noBtn = this.add.text(width / 2 + 100, height / 2 + 120, noButtonText, {
            fontSize: '30px',
            fill: '#fff',
            backgroundColor: '#107310',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive()
        .on('pointerout', () => {
            this.tweens.add({
                targets: this.noBtn,
                scale: 1.0,
                duration: 100,
                ease: 'Power1',
            });
        });

        const hoverTween = (target) => {
            this.tweens.add({
                targets: target,
                scale: 1.2,
                duration: 100,
                ease: 'Power1',
            });
        };

        this.yesBtn.on('pointerover', () => {
            this.sound.play('buttonHover', { volume: 2 * this.playerData.sfxVolume });
            hoverTween(this.yesBtn);
            if (data && data.onHoverYes) {
                data.onHoverYes();
            }
        });

        this.noBtn.on('pointerover', () => {
            this.sound.play('buttonHover', { volume: 2 * this.playerData.sfxVolume });
            hoverTween(this.noBtn);
            if (data && data.onHoverNo) {
                data.onHoverNo();
            }
        });

        /**
         * Events of the buttons
         */
        
        const defaultYes = () => {
            if (this.sceneToPause) {
                this.scene.stop(this.sceneToPause);
            }
            this.scene.stop('ConfirmMenu');
            this.scene.start('SelectionMenuScene');
        };
        const yesAction = (data && data.onYes) ? data.onYes : defaultYes;
        const noAction = (data && data.onNo) ? data.onNo : () => this.closeMenu();

        this.yesBtn.on('pointerdown', () => {
           
            this.transitionController.startFadeOutTransition(() => {
                yesAction();
               
            }, 400);
        });

        this.noBtn.on('pointerdown', () => {
            noAction();
        });

        this.input.keyboard.once('keydown-ESC', () => {
            noAction();
        });
        
        const elementsToAnimate = [this.box, this.titleText, this.yesBtn, this.noBtn];
        elementsToAnimate.forEach(el => el.setScale(0.8).setAlpha(0));
        this.tweens.add({
            targets: elementsToAnimate,
            scale: 1,
            alpha: 1,
            duration: 300,
            ease: 'Back.Out',
            delay: 100
        });
        
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
