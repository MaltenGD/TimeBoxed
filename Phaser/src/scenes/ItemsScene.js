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

        this.add.text(width / 2, height / 2 - 400, 'Items / Achievements', {
            fontSize: '58px',
            color: '#ffffff',
            fontFamily: 'rimouski',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        const backButton = this.add.text(width / 2, height - 100, 'Back', {
            fontSize: '48px',
            color: '#fff',
            backgroundColor: '#333',
            fontFamily: 'rimouski',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive();

        this.addAchievements();

        backButton.on('pointerdown', () => {
            this.exitItemsScene();
        });

        backButton.on('pointerover', () => {
            this.sound.play('buttonHover', { volume: 2 * this.playerData.sfxVolume });
            backButton.setBackgroundColor('#555');
            this.tweens.add({
                targets: backButton,
                scale: 1.1,
                duration: 200,
                ease: 'Sine.easeInOut'
            });
        });

        backButton.on('pointerout', () => {
            backButton.setBackgroundColor('#333');
            this.tweens.add({
                targets: backButton,
                scale: 1.0,
                duration: 200,
                ease: 'Sine.easeInOut'
            });
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

        this.add.text(this.width/2, this.height/3 - 50, `You have ${this.achManager.nrOfAwardedAchievements}/${this.achManager.nrOfAchievements}\n achievements unlocked\n\nClick on any achievemnt to see its info.`, {
            fontSize: '40px',
            color: '#dddddd',
            align: 'center',
            wordWrap: { width: this.width - 100 },
            fontFamily: 'rimouski'
        }).setOrigin(0.5);

        const achievements = Array.from(this.achManager.achievementMap.values());
        const maxAchPerRow = 6;
        const distance = 200;
        const startY = this.height/3 + distance;

        achievements.forEach((ach, index) => {
            console.log("Showing achievement:", ach);
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

            const achImage = this.add.image(x, y, ach.image).setScale(0.3).setOrigin(0.5);
            achImage.setInteractive({ useHandCursor: true });
            achImage.on('pointerdown', () => {
                this.scene.pause('ItemsScene');
                this.scene.launch('AchievementPanelScene', { playerData: this.playerData, achievement: ach });
            });

            if(!ach.awarded) achImage.setAlpha(0.75);

            achImage.on('pointerover', () => {
                this.sound.play('buttonHover', { volume: 2 * this.playerData.sfxVolume });
                this.tweens.add({
                    targets: achImage,
                    scale: 0.35,
                    duration: 200,
                    ease: 'Sine.easeInOut'
                });
            });

            achImage.on('pointerout', () => {
                this.tweens.add({
                    targets: achImage,
                    scale: 0.3,
                    duration: 200,
                    ease: 'Sine.easeInOut'
                });
            });


            if (ach.awarded) {
                this.add.text(x + 5, y + 80, 'Awarded!', {
                    fontSize: '24px',
                    fontFamily: 'rimouski',
                    color: '#5fc6e6ff'
                }).setOrigin(0.5);
            }

            console.log("Achievements shown.");
        })
    }
}