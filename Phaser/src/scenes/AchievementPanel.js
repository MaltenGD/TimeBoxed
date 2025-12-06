export class AchievementPanelScene extends Phaser.Scene {
    constructor(key) {
        super('AchievementPanelScene');
        
    }
    
    init(data) {
        this.playerData = data.playerData;
        this.closing = false;
        this.achievement = data.achievement;
    }

    create() {
        this.width = this.scale.width;
        this.height = this.scale.height;

        this.createMenu();
        this.animateMenuIn();
        this.input.keyboard.on('keydown-ESC', this.closeMenu, this);

    }

    /**
     * Creates the menu images.
     */
    createMenu() {
        // Black transparent overlay that also acts as a click target to close the menu
        this.overlayBackground = this.add.rectangle(0, 0, this.width, this.height, 0x000000, 0.75)
            .setOrigin(0, 0)
            .setInteractive()
            .setDepth(10)
            .on('pointerdown', () => this.closeMenu());

        this.Container = this.add.container(this.width / 2, this.height / 2)
            .setDepth(11);

        this.achImage = this.add.image(-500, 0  , this.achievement.image).setScale(0.8).setOrigin(0.5);
        this.achName = this.add.text(200, -160, this.achievement.name, {
            fontSize: '82px',
            color: '#ffffff',
            fontFamily: 'rimouski',
            align: 'center'
        })
        .setOrigin(0.5);
        this.achDesc = this.add.text(200, 0, "Requirement:\n " + this.achievement.description, {
            fontSize: '44px',
            color: '#ffffff',
            fontFamily: 'rimouski',
            wordWrap: { width: 800, useAdvancedWrap: true },
            align: 'center'
        })
        .setOrigin(0.5);

        const achCompletionText = this.achievement.awarded ? `You have unlocked this achievement!` : `You haven't unlocked this achievement yet.`;
        const achCompletionStyle = this.achievement.awarded ? '#5fc6e6ff' : '#f15757ff';

        this.helpText = this.add.text(this.width - 275, this.height - 100, 'Press ESC or click anywhere to close', {
            fontSize: '24px',
            color: '#ffffff',
            fontFamily: 'rimouski',
            align: 'center'
        })
        .setOrigin(0.5).setAlpha(0.8);

        this.achCompletionLabel = this.add.text(200, 150, achCompletionText, {
            fontSize: '28px',
            color: achCompletionStyle,
            fontFamily: 'rimouski',
            align: 'center'
        })
        .setOrigin(0.5);

        

        this.closeBtn = this.add.text(
            this.width / 2 - 100,
            -this.height / 2 + 100,
            "-",
            {
                fontSize: '32px',
                color: '#000000ff',
                backgroundColor: '#ffffffff',
                padding: { x: 8, y: 4 }
            }
        )
        .setOrigin(0.5)
        .setDepth(12)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => this.closeBtn.setStyle({ 
            color: '#ffcccc',
            backgroundColor: '#cc0000'
        }))
        .on('pointerout', () => this.closeBtn.setStyle({ 
            color: '#000000ff',
            backgroundColor: '#ffffffff'
        }))
        .on('pointerdown', () => this.closeMenu());

        this.Container.add([this.achImage, this.achName, this.achDesc, this.achCompletionLabel]);

        this.Container.setScale(0).setAlpha(0);
    }

    /**
     * Animates the menu upon open.
     */
    animateMenuIn() {
        this.tweens.add({
            targets: [this.overlayBackground, this.helpText, this.closeBtn], 
            alpha: 1,
            duration: 500,
            ease: 'Sine.easeOut',
            delay: 50
        });
        // Bouncy fade-in for the overlay
        this.tweens.add({
            targets: this.Container,
            scale: 1,
            alpha: 1,
            duration: 500,
            ease: 'Back.easeOut',
            delay: 50
        });

    }

    /**
     * Closes the menu.
     */
    closeMenu() {
        if (this.closing) return;
        this.closing = true;

        if (this.closeBtn) this.closeBtn.disableInteractive();
        if (this.overlayBackground) this.overlayBackground.disableInteractive();

        this.tweens.add({
            targets: this.Container,
            alpha: 0,
            duration: 250,
            ease: 'Sine.easeIn'
        })
        
        this.tweens.add({
            targets: [this.overlayBackground, this.helpText],
            alpha: 0,
            duration: 250,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                if (this.playerData && this.playerData.sceneToResume) {
                    const mainScene = this.scene.get(this.playerData.sceneToResume);
                    
                    if (mainScene) {
                        if (mainScene.scene.isPaused()) {
                            this.scene.resume(this.playerData.sceneToResume);
                        }
                    }
                }
                this.scene.resume('ItemsScene');
                this.scene.stop();
            }
        });

    }
}