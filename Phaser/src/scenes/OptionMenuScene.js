import TransitionController, {RGBColor} from "../misc/transitioncontroller.js";
import { BaseScene } from "./BaseScene.js";
/**
 * @file OptionMenuSene.js
 * @description Scene to pause the game and show options to the player
 */
export class OptionMenuScene extends BaseScene {
    constructor() {
        super('OptionMenu');
    }


    preload() {
        
    }
    create(playerData) {

        this.playerData = playerData;
        const { width, height } = this.scale;

        this.FromSelectionMenuOffset = this.playerData.FromSelectionMenu ? 100 : 0;
        console.log("FromSelectionMenu: " + this.playerData.FromSelectionMenu);

        let resumeBtnCoords = {
            x : width / 2 - 160 + this.FromSelectionMenuOffset,
            y : height / 2 - 300 + this.FromSelectionMenuOffset
        }
        let helpBtnCoords = {
            x : width / 2 - 60 + this.FromSelectionMenuOffset,
            y : height / 2 - 100 + this.FromSelectionMenuOffset
        }
        let itemsBtnCoords = {
            x : width / 2 + 80 + this.FromSelectionMenuOffset,
            y : height / 2 + 100 + this.FromSelectionMenuOffset
        }
        let exitBtnCoords = {
            x : width / 2 + 225,
            y : height / 2 + 300
        }
        let settingsBtnCoords = {
            x : width / 2 + 600,
            y : height / 2 + 450
        }

        const baseImageKey = this.playerData.TimeboxedMode ? 'OptionMenuBaseTB' : 'OptionMenuBase';
        const resumeButtonKey = this.playerData.TimeboxedMode ? 'ResumeButtonNormalTB' : 'ResumeButtonNormal';
        const resumeButtonHoveredKey = this.playerData.TimeboxedMode ? 'ResumeButtonHoveredTB' : 'ResumeButtonHovered';
        const helpButtonKey = this.playerData.TimeboxedMode ? 'HelpButtonNormalTB' : 'HelpButtonNormal';
        const helpButtonHoveredKey = this.playerData.TimeboxedMode ? 'HelpButtonHoveredTB' : 'HelpButtonHovered';
        const itemsButtonKey = this.playerData.TimeboxedMode ? 'ItemsButtonNormalTB' : 'ItemsButtonNormal';
        const itemsButtonHoveredKey = this.playerData.TimeboxedMode ? 'ItemsButtonHoveredTB' : 'ItemsButtonHovered';
        const exitButtonKey = this.playerData.TimeboxedMode ? 'ExitButtonNormalTB' : 'ExitButtonNormal';
        const exitButtonHoveredKey = this.playerData.TimeboxedMode ? 'ExitButtonHoveredTB' : 'ExitButtonHovered';
        const settingsButtonKey = this.playerData.TimeboxedMode ? 'SettingsIconTB' : 'SettingsIcon';
        const settingsButtonHoveredKey = this.playerData.TimeboxedMode ? 'SettingsIconHoveredTB' : 'SettingsIconHovered';


        this.transitionController = new TransitionController(this);

        const base = this.add.image(width / 2, height / 2, baseImageKey);

        let resumeBtn = this.add.image(resumeBtnCoords.x, resumeBtnCoords.y, resumeButtonKey).setInteractive();
        let helpBtn = this.add.image(helpBtnCoords.x, helpBtnCoords.y, helpButtonKey).setInteractive();
        let itemsBtn = this.add.image(itemsBtnCoords.x, itemsBtnCoords.y, itemsButtonKey).setInteractive();
        let exitBtn = this.add.image(exitBtnCoords.x, exitBtnCoords.y, exitButtonKey)
        let settingsBtn = this.add.image(settingsBtnCoords.x, settingsBtnCoords.y, settingsButtonKey).setScale(0.15).setInteractive();

        if (this.playerData.FromSelectionMenu) exitBtn.setAlpha(0);
        else exitBtn.setInteractive();
            
        /**Button Hovering Behaviour */

        resumeBtn.on('pointerover', () => {
            this.sound.play('buttonHover', { volume: 2 * this.playerData.sfxVolume });
            this.tweens.killTweensOf(resumeBtn);
            resumeBtn.setTexture(resumeButtonHoveredKey);
            this.tweens.add({
                targets: resumeBtn,
                scale: 1.1,
                duration: 200,
                ease: 'Power1'
            });
        });
        resumeBtn.on('pointerout', () => {
            this.tweens.killTweensOf(resumeBtn);
            resumeBtn.setTexture(resumeButtonKey);
            this.tweens.add({
                targets: resumeBtn,
                scale: 1.0,
                duration: 150,
                ease: 'Power1'
            });
        });


        helpBtn.on('pointerover', () => {
            this.sound.play('buttonHover', { volume: 2 * this.playerData.sfxVolume });
            this.tweens.killTweensOf(helpBtn);
            helpBtn.setTexture(helpButtonHoveredKey);
            this.tweens.add({
                targets: helpBtn,
                scale: 1.1,
                duration: 200,
                ease: 'Power1'
            });
        });
        helpBtn.on('pointerout', () => {
            this.tweens.killTweensOf(helpBtn);
            helpBtn.setTexture(helpButtonKey);
            this.tweens.add({
                targets: helpBtn,
                scale: 1.0,
                duration: 150,
                ease: 'Power1'
            });
        });


        itemsBtn.on('pointerover', () => {
            this.sound.play('buttonHover', { volume: 2 * this.playerData.sfxVolume });
            this.tweens.killTweensOf(itemsBtn);
            itemsBtn.setTexture(itemsButtonHoveredKey);
            this.tweens.add({
                targets: itemsBtn,
                scale: 1.1,
                duration: 200,
                ease: 'Power1'
            });
        });
        itemsBtn.on('pointerout', () => {
            this.tweens.killTweensOf(itemsBtn);
            itemsBtn.setTexture(itemsButtonKey);
            this.tweens.add({
                targets: itemsBtn,
                scale: 1.0,
                duration: 150,
                ease: 'Power1'
            });
        });


        exitBtn.on('pointerover', () => {
            this.sound.play('buttonHover', { volume: 2 * this.playerData.sfxVolume });
            this.tweens.killTweensOf(exitBtn);
            exitBtn.setTexture(exitButtonHoveredKey);
            this.tweens.add({
                targets: exitBtn,
                scale: 1.1,
                duration: 200,
                ease: 'Power1'
            });
        });
        exitBtn.on('pointerout', () => {
            this.tweens.killTweensOf(exitBtn);
            exitBtn.setTexture(exitButtonKey);
            this.tweens.add({
                targets: exitBtn,
                scale: 1.0,
                duration: 150,
                ease: 'Power1'
            });
        });

        settingsBtn.on('pointerover', () => {
            this.sound.play('buttonHover', { volume: 2 * this.playerData.sfxVolume });
            this.tweens.killTweensOf(settingsBtn);
            settingsBtn.setTexture(settingsButtonHoveredKey);
            this.tweens.add({
                targets: settingsBtn,
                scale: 0.20,
                duration: 200,
                ease: 'Power1'
            });
        });
        settingsBtn.on('pointerout', () => {
            this.tweens.killTweensOf(settingsBtn);
            settingsBtn.setTexture(settingsButtonKey);
            this.tweens.add({
                targets: settingsBtn,
                scale: 0.15,
                duration: 150,
                ease: 'Power1'
            });
        });

        settingsBtn.on('pointerdown', () => {
            this.scene.pause();
            this.scene.launch('SettingsScene', {
                fromScene: 'OptionMenu',
                playerData: this.playerData
            });
        });

        /**Button Click Behaviour */


        resumeBtn.on('pointerdown', () => {
            this.close();
        })

        helpBtn.on('pointerdown', () => {
           
            this.scene.pause();
            this.scene.launch('HelpLobbyScene', this.playerData);

        });

        itemsBtn.on('pointerdown', () => {

            this.scene.pause();
            this.scene.launch('ItemsScene', this.playerData);
            
        })



        exitBtn.on('pointerdown', () => {
            if (this.scene.isActive('ConfirmMenu')) return;

            this.scene.pause();
            this.scene.launch('ConfirmMenu',{
                sceneToPause: this.scene.key,
                playerData: this.playerData,
                text: "Do you want to go back to the present?\n Your current progress will be lost.",
                onYes: () => {         
                    this.scene.stop(this.playerData.SceneToResume);
                    this.scene.stop('ConfirmMenu');
                    this.scene.stop('OptionMenu');
                    this.scene.start('SelectionMenuScene', this.playerData);

                    
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
    this.scene.resume(this.playerData.SceneToResume);
    this.scene.stop('OptionMenu');
    }

}
