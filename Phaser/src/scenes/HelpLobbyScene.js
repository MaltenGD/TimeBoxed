import { BaseScene } from "./BaseScene.js";
/**
 * @file HelpLobbyScene.js
 * @description A scene to display all 3 game tutorials in the form of buttons.
 */
export class HelpLobbyScene extends BaseScene {
    constructor() {
        super('HelpLobbyScene');
       
    }



    preload() {
    }

    create(playerData) {

         this.playerData = playerData;
        console.log(this.playerData)

        this.DisableOptionMenu();
        
        const { width, height } = this.scale;

        if (this.playerData.TimeboxedMode) this.background = this.add.image(width / 2, height / 2, 'backgroundTB').setDisplaySize(width, height);
        else this.background = this.add.image(width / 2, height / 2, 'background').setDisplaySize(width, height);

        // Define reusable font styles
        const titleStyle = {
            fontSize: '48px',
            fill: '#ffffff',
            fontStyle: 'bold',
            fontFamily: 'rimouski'
        };

        const bodyStyle = {
            fontSize: '24px',
            fill: '#dddddd',
            align: 'center',
            wordWrap: { width: width - 100 },
            fontFamily: 'rimouski'
        };

        const buttonStyle = {
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#333',
            padding: { x: 20, y: 10 },
            fontFamily: 'rimouski'
        };

        // Add some placeholder help text
        this.add.text(width / 2, height / 2 - 350, 'Help Lobby', titleStyle).setOrigin(0.5);

        this.add.text(width / 2, height / 2 - 250, 'This is the help lobby, here you can learn about the minigames.\n\nPress ESC or click Back to return.', bodyStyle).setOrigin(0.5);

        // Add a "Back" button to return to the previous menu
        const backButton = this.add.text(width / 2, height - 100, 'Back', buttonStyle)
        .setOrigin(0.5)
        .setInteractive();

        backButton.on('pointerdown', () => {
            this.exitHelpLobby();
        });

        backButton.on('pointerover', () => backButton.setBackgroundColor('#555'));
        backButton.on('pointerout', () => backButton.setBackgroundColor('#333'));

        // Also allow exiting with the ESC key
        this.input.keyboard.once('keydown-ESC', () => {
            this.exitHelpLobby();
        });


        this.addTutorialButton(width/3 - 50, height/2 - 50, 'Aseb Tutorial', 'TutorialAseb');
        this.addTutorialButton(width/2, height/2 - 50, 'Tali Tutorial', 'TaliTutorial');
        this.addTutorialButton(width/2+400, height/2-50, 'Hanafuda Tutorial','TutorialHanafuda' );

        // this.AsebTutorialBtn = this.add.text(width / 3, height / 2 - 50, 'Aseb Tutorial', {
        //     fontSize: '36px',
        //     fill: '#fff',
        //     backgroundColor: '#555',
        //     padding: { x: 15, y: 50 }
        // }).setOrigin(0.5).setInteractive();

        // this.AsebTutorialBtn.on('pointerover', () => {
        //     //this.AsebTutorialBtn.setBackgroundColor('#777');
        //     //this.AsebTutorialBtn.setStyle({ fill: '#ffff00' });
        //     this.tweens.add({
        //         targets: this.AsebTutorialBtn,
        //         scale: 1.1,
        //         duration: 200,
        //         ease: 'Back.easeOut' // Bouncy effect on hover
        //     });
        // });

        // this.AsebTutorialBtn.on('pointerout', () => {
        //     //this.AsebTutorialBtn.setBackgroundColor('#555');
        //     //this.AsebTutorialBtn.setStyle({ fill: '#fff' });
        //     this.tweens.add({
        //         targets: this.AsebTutorialBtn,
        //         scale: 1.0,
        //         duration: 150,
        //         ease: 'Sine.easeOut' // Smooth and quick, no delay
        //     });
        // });

        // this.AsebTutorialBtn.on('pointerdown', () => {
        //     this.AsebTutorialBtn.setBackgroundColor('#555');
        //     this.AsebTutorialBtn.setStyle({ fill: '#fff' });
        //     this.playerData.comingFromMenu = true;
        //     this.scene.launch('TutorialAseb', this.playerData);
        //     this.scene.pause();
        // });
    }

    /**
     * Adds a tutorial button at the specified position.
     * @param {number} x X position in the scene.
     * @param {number} y Y position in the scene.
     * @param {string} text The text to show in the button. 
     * @param {string} sceneToLaunch The scene to launch when pressing the button.
     */
    addTutorialButton(x, y, text, sceneToLaunch) {
        const tutorialButtonStyle = {
            fontSize: '36px',
            fill: '#fff',
            backgroundColor: '#555',
            padding: { x: 15, y: 50 },
            fontFamily: 'rimouski'
        };

        const btn = this.add.text(x, y, text, tutorialButtonStyle).setOrigin(0.5).setInteractive();

        btn.on('pointerover', () => {
            btn.setBackgroundColor('#777');
            btn.setStyle({ fill: '#ffff00' });
            this.tweens.add({
                targets: btn,
                scale: 1.1,
                duration: 200,
                ease: 'Back.easeOut' // Bouncy effect on hover
            });
        });

        btn.on('pointerout', () => {
            btn.setBackgroundColor('#555');
            btn.setStyle({ fill: '#fff' });
            this.tweens.add({
                targets: btn,
                scale: 1.0,
                duration: 150,
                ease: 'Sine.easeOut' // Smooth and quick, no delay
            });
        });

        btn.on('pointerdown', () => {
            console.log('clicked');
            btn.setBackgroundColor('#555');
            btn.setStyle({ fill: '#fff' });
            this.playerData.comingFromMenu = true;
            this.scene.launch(sceneToLaunch, this.playerData);
            this.scene.pause();
        });

    }

    exitHelpLobby() {
        // Stop the current scene
        this.scene.stop('HelpLobbyScene');
        // Resume the scene that launched this one
        this.scene.resume('OptionMenu');
    }
}