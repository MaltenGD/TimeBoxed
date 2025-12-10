export class YakusMenu extends Phaser.Scene {
    constructor() {
        super('YakusMenu');
    }

    init(data) {
        this.playerData = data;
        this.closing = false;
    }

    create() {


        const width = this.scale.width;
        const height = this.scale.height;

        this.overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.5)
            .setOrigin(0, 0)
            .setInteractive()
            .setDepth(10)
            .on('pointerdown', () => this.closeMenu());

        const imageWidth = width;
        const imageHeight = height;
        this.imageContainer = this.add.container(width / 2, height / 2)
            .setDepth(11);
        
        const elementsToAdd = [];
        this.combinationsImage = this.add.image(0, 0, 'TutorialCombination')
            .setOrigin(0.5)
            .setDisplaySize(imageWidth, imageHeight);
        
        elementsToAdd.push(this.combinationsImage);


        this.closeBtn = this.add.text(
            imageWidth / 2 - 20,
            -imageHeight / 2 + 20,
            "X",
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

        elementsToAdd.push(this.closeBtn);
        this.imageContainer.add(elementsToAdd);

        this.overlay.setAlpha(0);
        this.imageContainer.setScale(0);
        this.imageContainer.setAlpha(0);

        this.tweens.add({
            targets: this.overlay,
            alpha: 0.5,
            duration: 200,
            ease: 'Cubic.easeOut'
        });

        this.tweens.add({
            targets: this.imageContainer,
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            duration: 300,
            ease: 'Back.easeOut',
            delay: 50
        });

        console.log("YakusMenu creadp");
    }

    closeMenu() {
        console.log("closeMenu llamado, closing:", this.closing);

        if (this.closing) return;
        this.closing = true;

        if (this.closeBtn) this.closeBtn.disableInteractive();
        if (this.overlay) this.overlay.disableInteractive();

        // salida
        this.tweens.add({
            targets: this.imageContainer,
            scaleX: 0,
            scaleY: 0,
            alpha: 0,
            duration: 250,
            ease: 'Back.easeIn'
        });

        this.tweens.add({
            targets: this.overlay,
            alpha: 0,
            duration: 250,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                console.log("Animation completada, reanudando escena principal");
                
                if (this.playerData && this.playerData.sceneToResume) {
                    console.log("Escena reanudar:", this.playerData.sceneToResume);
                    const mainScene = this.scene.get(this.playerData.sceneToResume);
                    
                    if (mainScene) {
                        console.log("Escena principal encontrada, está pausada?", mainScene.scene.isPaused());
                        if (mainScene.scene.isPaused()) {
                            this.scene.resume(this.playerData.sceneToResume);
                            console.log("Escena reanudada");
                        }
                    }
                }

                console.log("YakusMenu parado");
                this.scene.stop();
            }
        });
    }
}