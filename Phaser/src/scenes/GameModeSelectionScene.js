import TransitionController, {RGBColor} from "../misc/transitioncontroller.js";
import { BaseScene } from "./BaseScene.js";
/**
 * @file GameModeSelectionScene.js
 * @description Scene to pause the game and show options to the player
 */
export class GameModeSelectionScene extends BaseScene {
    constructor() {
        super('GameModeSelection');
    }

    /**
     * Creates the scene.
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
        this.box = this.add.rectangle(width / 2, height / 2, 1100, 800, 0x111111, 1)
            .setStrokeStyle(4, 0x0055CC)
            .setOrigin(0.5);
        
        /**
         * Text
         */
        const titleText =  'Select Your Game Mode';
        const defaultDescText = 'Hover over each mode to see its description.';
        this.sceneToPause = data ? data.PausedScene : undefined;

        // Ensure the title text stays inside the central box with padding and wraps if necessary
        const padding = 40;
        const maxTextWidth = this.box.width - padding * 2;

        this.titleText = this.add.text(width / 2, height / 2 - 250, titleText, {
            fontSize: '40px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: maxTextWidth, useAdvancedWrap: true }
        }).setOrigin(0.5);
        this.descText = this.add.text(width / 2, height / 2 -100, defaultDescText, {
            fontSize: '36px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: maxTextWidth - 100, useAdvancedWrap: true }
        }).setOrigin(0.5);

        /**
         * Helper function to animate description text changes.
         * It fades the text out, changes the content, and fades it back in.
         */
        const updateDescriptionText = (newText) => {
            // Stop any currently running tweens on the description text to avoid conflicts
            this.tweens.killTweensOf(this.descText);

            this.tweens.add({
                targets: this.descText,
                scale: 0.9,
                duration: 50,
                ease: 'Power1',
                onComplete: () => {
                    this.descText.setText(newText);
                    // Chain the fade-in tween
                    this.tweens.add({ targets: this.descText, scale: 1, duration: 150, ease: 'Power2' });
                }
            });
        };

        const hoverTween = (target) => {
            this.tweens.add({
                targets: target,
                scale: 1.2,
                duration: 100,
                ease: 'Power1',
            });
        };

        /**
         * Yes botton
         */
        const NormalButtonText = 'Normal';
        this.NormalBtn = this.add.text(width / 2 - 200, height / 2 + 240, NormalButtonText, {
            fontSize: '60px',
            fill: '#fff',
            backgroundColor: '#0055cc',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();


        

        /**
         * No botton
         */
        const TimeboxedButtonText = 'TimeBoxed';
        this.TimeboxedBtn = this.add.text(width / 2 + 200, height / 2 + 240, TimeboxedButtonText, {
            fontSize: '60px',
            fill: '#fff',
            backgroundColor: '#8B0000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();
        

        

        

        // --- Pop-up Animation ---

        const elementsToAnimate = [this.box, this.titleText, this.descText, this.NormalBtn, this.TimeboxedBtn];
        elementsToAnimate.forEach(el => el.setScale(0.8).setAlpha(0));

        this.tweens.add({
            targets: elementsToAnimate,
            scale: 1,
            alpha: 1,
            duration: 300,
            ease: 'Back.Out',
            delay: 100,
            onComplete: () => {

            this.NormalBtn.on('pointerover', () => {
            this.sound.play('buttonHover', { volume: 2 * this.playerData.sfxVolume });
            hoverTween(this.NormalBtn);
            updateDescriptionText('Normal Mode: Enjoy the normal pace without the risk of losing progress upon failure.');
           
            })
            .on('pointerout', () => {
                this.tweens.add({
                    targets: this.NormalBtn,
                    scale: 1.0,
                    duration: 100,
                    ease: 'Power1',
                });
                updateDescriptionText(defaultDescText);
            })
            .on('pointerdown', () => {
           
            this.transitionController.startFadeOutTransition(() => {
                this.playerData.TimeboxedMode = false;
                this.scene.start('Intro', this.playerData);
               
            }, 400);
            });

            this.TimeboxedBtn.on('pointerover', () => {
                this.sound.play('buttonHover', { volume: 2 * this.playerData.sfxVolume });
                hoverTween(this.TimeboxedBtn);
                updateDescriptionText('TimeBoxed Mode: A high-risk experience where losing a game means starting over from the beginning. Complete the game in this mode to earn an exclusive achievement!');
                
            })
            .on('pointerout', () => {
                this.tweens.add({
                    targets: this.TimeboxedBtn,
                    scale: 1.0,
                    duration: 100,
                    ease: 'Power1',
                });
                updateDescriptionText(defaultDescText)
            }) .on('pointerdown', () => {
           
            this.transitionController.startFadeOutTransition(() => {
                this.playerData.TimeboxedMode = true;
                this.scene.start('Intro', this.playerData);
               
            }, 400);
            });
            }
        });
        
    }

    setPausedScene(sceneName) {
        this.sceneToPause = sceneName;
    }
}
