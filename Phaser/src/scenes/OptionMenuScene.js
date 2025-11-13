import TransitionController, {RGBColor} from "../misc/transitioncontroller.js";

/**
 * @file OptionMenuSene.js
 * @description Scene to pause the game and show options to the player
 */
export class OptionMenuScene extends Phaser.Scene {
    constructor() {
        super('OptionMenu');
    }


    preload() {
        this.load.image('OptionMenuBase', 'Phaser/assets/OptionMenu/OptionMenuBase.png');
        this.load.image('ResumeButtonNormal', 'Phaser/assets/OptionMenu/ResumeNormal.png');
        this.load.image('ResumeButtonHovered', 'Phaser/assets/OptionMenu/ResumeHovered.png');
        this.load.image('HelpButtonNormal', 'Phaser/assets/OptionMenu/HelpNormal.png');
        this.load.image('HelpButtonHovered', 'Phaser/assets/OptionMenu/HelpHovered.png');
        this.load.image('ItemsButtonNormal', 'Phaser/assets/OptionMenu/ItemsNormal.png');
        this.load.image('ItemsButtonHovered', 'Phaser/assets/OptionMenu/ItemsHovered.png');
        this.load.image('ExitButtonNormal', 'Phaser/assets/OptionMenu/ExitNormal.png');
        this.load.image('ExitButtonHovered', 'Phaser/assets/OptionMenu/ExitHovered.png');
    }
    create(data) {

        const { width, height } = this.scale;

        let resumeBtnCoords = {
            x : width / 2 - 160,
            y : height / 2 - 300
        }
        let helpBtnCoords = {
            x : width / 2 - 60,
            y : height / 2 - 100
        }
        let itemsBtnCoords = {
            x : width / 2 + 80,
            y : height / 2 + 100
        }
        let exitBtnCoords = {
            x : width / 2 + 225,
            y : height / 2 + 300
        }



        this.transitionController = new TransitionController(this);

        const base = this.add.image(width / 2, height / 2, 'OptionMenuBase')

        let resumeBtn = this.add.image(resumeBtnCoords.x, resumeBtnCoords.y, 'ResumeButtonNormal').setInteractive();
        let helpBtn = this.add.image(helpBtnCoords.x, helpBtnCoords.y, 'HelpButtonNormal').setInteractive();
        let itemsBtn = this.add.image(itemsBtnCoords.x, itemsBtnCoords.y, 'ItemsButtonNormal').setInteractive();
        let exitBtn = this.add.image(exitBtnCoords.x, exitBtnCoords.y, 'ExitButtonNormal').setInteractive();


        /**Button Hovering Behaviour */

        resumeBtn.on('pointerover', () => {
            resumeBtn.setTexture('ResumeButtonHovered');
        });
        resumeBtn.on('pointerout', () => {
            resumeBtn.setTexture('ResumeButtonNormal');
        });


        helpBtn.on('pointerover', () => {
            helpBtn.setTexture('HelpButtonHovered');
        });
        helpBtn.on('pointerout', () => {
            helpBtn.setTexture('HelpButtonNormal');
        });


        itemsBtn.on('pointerover', () => {
            itemsBtn.setTexture('ItemsButtonHovered');
        });
        itemsBtn.on('pointerout', () => {
            itemsBtn.setTexture('ItemsButtonNormal');
        });


        exitBtn.on('pointerover', () => {
            exitBtn.setTexture('ExitButtonHovered');
        });
        exitBtn.on('pointerout', () => {
            exitBtn.setTexture('ExitButtonNormal');
        });


        /**Button Click Behaviour */


        resumeBtn.on('pointerdown', () => {
            this.scene.resume(data.sceneToPause);
            this.scene.stop('OptionMenu');
        })

        exitBtn.on('pointerdown', () => {
            if (this.scene.isActive('PauseMenu')) return;

            this.scene.pause();
            this.scene.launch('PauseMenu',{
                sceneToPause: this.scene.key,
                text: "Do you want to go to the main menu?",
                onYes: () => {
                    // Assuming the main game scene that was paused should also be stopped.
                    this.scene.stop(data.sceneToPause);
                    this.scene.stop('PauseMenu');
                    this.scene.stop('OptionMenu');
                    this.scene.start('Start');
                },
                onNo: () => {
                    this.scene.stop('PauseMenu');
                    this.scene.resume('OptionMenu');
                }
            });
        });
        
        
    }

}
