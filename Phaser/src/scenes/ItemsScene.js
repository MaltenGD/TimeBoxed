/**
 * @file ItemsScene.js
 * @description A scene to display the player's achievements or badges.
 */
export class ItemsScene extends Phaser.Scene {
    constructor() {
        super('ItemsScene');
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

        this.add.text(width / 2, height / 2 - 350, 'Items', {
            fontSize: '48px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 - 250, 'This is your inventory, where you can view your achievements and badges.\n\nPress ESC or click Back to return.', {
            fontSize: '24px',
            fill: '#dddddd',
            align: 'center',
            wordWrap: { width: width - 100 }
        }).setOrigin(0.5);

        const backButton = this.add.text(width / 2, height - 100, 'Back', {
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#333',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive();

        backButton.on('pointerdown', () => {
            this.exitItemsScene();
        });

        this.input.keyboard.once('keydown-ESC', () => {
            this.exitItemsScene();
        });
    }

    exitItemsScene() {
        // Stop the current scene
        this.scene.stop('ItemsScene');
        // Resume the scene that launched this one
        if (this.sceneToResume) {
            this.scene.resume(this.sceneToResume);
        }
    }
}