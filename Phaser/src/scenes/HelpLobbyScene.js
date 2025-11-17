/**
 * @file HelpLobbyScene.js
 * @description A scene to display all 3 game tutorials in the form of buttons.
 */
export class HelpLobbyScene extends Phaser.Scene {
    constructor() {
        super('HelpLobbyScene');
       
    }



    preload() {
    }

    create(playerData) {

         this.playerData = playerData;
        console.log(this.playerData)
        
        const { width, height } = this.scale;

        if (this.playerData.TimeboxedMode) this.background = this.add.image(width / 2, height / 2, 'backgroundTB').setDisplaySize(width, height);
        else this.background = this.add.image(width / 2, height / 2, 'background').setDisplaySize(width, height);

        // Add some placeholder help text
        this.add.text(width / 2, height / 2 - 350, 'Help Lobby', {
            fontSize: '48px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 - 250, 'This is the help lobby, here you can learn about the minigames.\n\nPress ESC or click Back to return.', {
            fontSize: '24px',
            fill: '#dddddd',
            align: 'center',
            wordWrap: { width: width - 100 }
        }).setOrigin(0.5);

        // Add a "Back" button to return to the previous menu
        const backButton = this.add.text(width / 2, height - 100, 'Back', {
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#333',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive();

        backButton.on('pointerdown', () => {
            this.exitHelpLobby();
        });

        // Also allow exiting with the ESC key
        this.input.keyboard.once('keydown-ESC', () => {
            this.exitHelpLobby();
        });
    }

    exitHelpLobby() {
        // Stop the current scene
        this.scene.stop('HelpLobbyScene');
        // Resume the scene that launched this one
        this.scene.resume('OptionMenu');
    }
}