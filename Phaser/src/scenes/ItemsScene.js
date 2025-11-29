import { BaseScene } from "./BaseScene.js";
/**
 * @file ItemsScene.js
 * @description A scene to display the player's achievements or badges.
 */
export class ItemsScene extends BaseScene {
    constructor() {
        super('ItemsScene');
       
    }

    create(playerData) {

         this.playerData = playerData;
        console.log(this.playerData)

        this.DisableOptionMenu();

        const { width, height } = this.scale;
        this.width = width;
        this.height = height;

        if (this.playerData.TimeboxedMode) this.background = this.add.image(width / 2, height / 2, 'backgroundTB').setDisplaySize(width, height);
        else this.background = this.add.image(width / 2, height / 2, 'background').setDisplaySize(width, height);

        this.add.text(width / 2, height / 2 - 350, 'Items', {
            fontSize: '48px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const backButton = this.add.text(width / 2, height - 100, 'Back', {
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#333',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive();

        this.addAchievements();

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
        this.scene.resume('OptionMenu');
    }

    /**
     * Displays all the achievements.
     */
    addAchievements() {
        this.achManager = this.registry.get('AchievementManager');

        this.add.text(this.width / 2, this.height / 3.7, 'Achievements', {
            fontSize: '60px',
            fill: '#dddddd',
            align: 'center',
            wordWrap: { width: this.width - 100 }
        }).setOrigin(0.5);

        this.add.text(this.width/2, this.height/3, `You have ${this.achManager.nrOfAwardedAchievements}/${this.achManager.nrOfAchievements}`, {
            fontSize: '40px',
            fill: '#dddddd',
            align: 'center',
            wordWrap: { width: this.width - 100 }
        }).setOrigin(0.5);

        const achievements = Array.from(this.achManager.achievementMap.values());
        const maxAchPerRow = 6;
        const distance = 200;
        const startY = this.height/3 + distance;

        achievements.forEach((ach, index) => {
            const row = Math.floor(index / maxAchPerRow);
            const col = index % maxAchPerRow;

            const itemsInRow = Math.min(
                maxAchPerRow,
                achievements.length - row * maxAchPerRow
            );

            const rowWidth = (itemsInRow - 1) * distance;
            const startX = this.width / 2 - rowWidth /2;

            const x = startX + col * distance;
            const y = startY + row * distance;

            this.add.image(x, y, ach.image).setScale(0.3).setOrigin(0.5);
            if (ach.awarded) {
                this.add.text(x + 5, y + 80, 'Awarded!', {fontSize: '24px'}).setOrigin(0.5);
            }

            console.log("Achievements shown.");
        })
    }
}