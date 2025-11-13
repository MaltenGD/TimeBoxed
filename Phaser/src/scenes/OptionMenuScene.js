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
        
    }
    create(data) {

        this.data = data;
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
            this.close();
        })

        helpBtn.on('pointerdown', () => {
            if (this.scene.isActive('ConfirmMenu')) return;

            this.scene.pause();
            this.scene.launch('ConfirmMenu',{
                sceneToPause: this.scene.key,
                text: "Do you want to go to the help lobby? \n your changes will not be saved",
                onYes: () => {
                    // Assuming the main game scene that was paused should also be stopped.
                    this.scene.stop(data.sceneToPause);
                    this.scene.stop('ConfirmMenu');
                    this.scene.stop('OptionMenu');
                    this.scene.start('Start');
                },
                onNo: () => {
                    this.scene.stop('ConfirmMenu');
                    this.scene.resume('OptionMenu');
                }
            });
        });


        exitBtn.on('pointerdown', () => {
            if (this.scene.isActive('ConfirmMenu')) return;

            this.scene.pause();
            this.scene.launch('ConfirmMenu',{
                sceneToPause: this.scene.key,
                text: "Do you want to go to the main menu?",
                onYes: () => {
                    // Assuming the main game scene that was paused should also be stopped.
                    this.scene.stop(data.sceneToPause);
                    this.scene.stop('ConfirmMenu');
                    this.scene.stop('OptionMenu');
                    this.scene.start('Start');
                },
                onNo: () => {
                    this.scene.stop('ConfirmMenu');
                    this.scene.resume('OptionMenu');
                }
            });
        });
        

        /** Keyboard listeners */

         this.input.keyboard.on('keydown-ESC', () => {
            this.close();
        });
        
    }
    close()
    {
    this.scene.resume(this.data.sceneToPause);
    this.scene.stop('OptionMenu');
    }

}
