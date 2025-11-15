/**
 * @file HelpLobbyScene.js
 * @description A scene to display all 3 game tutorials in the form of buttons.
 */
export class HelpLobbyScene extends Phaser.Scene {
    constructor() {
        super('HelpLobbyScene');
        this.sceneToResume = null; // To store the key of the scene to resume
    }

    /**
     * Initializes the scene and receives data from the launching scene.
     * @param {object} data - The data object passed from the launching scene.
     * @param {string} data.sceneToResume - The key of the scene to resume upon exiting.
     */
    init(data) {
        this.sceneToResume = data.sceneToResume;
    }

    preload() {
    }

    create() {
        const { width, height } = this.scale;

        this.background = this.add.image(width / 2, height / 2, 'background').setDisplaySize(width, height);


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
        if (this.sceneToResume) {
            this.scene.resume(this.sceneToResume);
        }
    }
}