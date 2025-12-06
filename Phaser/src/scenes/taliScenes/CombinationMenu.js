export class CombinatinMenu extends Phaser.Scene {
    constructor() {
        super('CombinationMenu');
    }
    
    init(data) {
        this.playerData = data;
        this.closing = false;
    }

    create() {
        this.width = this.scale.width;
        this.height = this.scale.height;

        this.createMenu();
        this.animateMenuIn();

    }

    /**
     * Creates the menu images.
     */
    createMenu() {
        this.overlay = this.add.rectangle(0, 0, this.width, this.height, 0x000000, 0.5)
            .setOrigin(0, 0)
            .setInteractive()
            .setDepth(10)
        .on('pointerdown', () => this.closeMenu());

        const imageWidth = this.width * 0.8;
        const imageHeight = (imageWidth * 2) / 3;
        this.imageContainer = this.add.container(this.width / 2, this.height / 2)
            .setDepth(11);

        this.combinationsImage = this.add.image(0, 0, 'TaliCombinations')
            .setOrigin(0.5)
            .setDisplaySize(imageWidth, imageHeight);

        this.closeBtn = this.add.text(
            imageWidth / 2 - 20,
            -imageHeight / 2 + 20,
            "-",
            {
                fontSize: '32px',
                color: '#ffffff',
                backgroundColor: '#1aaa00ff',
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
            color: '#ffffff',
            backgroundColor: '#aa0000'
        }))
        .on('pointerdown', () => this.closeMenu());

        this.imageContainer.add([this.combinationsImage, this.closeBtn]);

        this.overlay.setAlpha(0);
        this.imageContainer.setScale(1);
        this.imageContainer.setAlpha(0);
    }

    /**
     * Animates the menu upon open.
     */
    animateMenuIn() {
        this.tweens.add({
            targets: this.overlay,
            alpha: 0.5,
            duration: 200,
            ease: 'Cubic.easeOut'
        });

        this.tweens.add({
            targets: this.imageContainer,
            alpha: 1,
            duration: 500,
            ease: 'Sine.easeOut',
            delay: 50
        });
    }

    /**
     * Closes the combination menu.
     */
    closeMenu() {
        if (this.closing) return;
        this.closing = true;

        if (this.closeBtn) this.closeBtn.disableInteractive();
        if (this.overlay) this.overlay.disableInteractive();

        this.tweens.add({
            targets: this.imageContainer,
            alpha: 0,
            duration: 250,
            ease: 'Sine.easeIn'
        });

        this.tweens.add({
            targets: this.overlay,
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
                this.scene.stop();
            }
        });
    }
}