export class PauseMenuScene extends Phaser.Scene {
    constructor() {
        super('PauseMenu');
    }

    create() {
        const { width, height } = this.scale;

        //Fondo
        this.overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6)
            .setOrigin(0.5);

        //Caja del centro
        this.box = this.add.rectangle(width / 2, height / 2, 700, 500, 0x111111, 1)
            .setStrokeStyle(4, 0xAA0000)
            .setOrigin(0.5);
        
        //Texto
        this.titleText = this.add.text(width / 2, height / 2 - 80, 'Do you want to go back?', {
            fontSize: '28px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        this.yesBtn = this.add.text(width / 2 - 100, height / 2 + 60, 'Yes', {
            fontSize: '30px',
            fill: '#fff',
            backgroundColor: '#8B0000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();


        this.noBtn = this.add.text(width / 2 + 100, height / 2 + 60, 'No', {
            fontSize: '30px',
            fill: '#fff',
            backgroundColor: '#107310',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();


        this.yesBtn.on('pointerdown', () => {
        if (this.sceneToPause) {
        this.scene.stop(this.sceneToPause);  // 🔥 destruye la escena en pausa
        }
        this.scene.stop('PauseMenu');
        this.scene.start('SelectionMenuScene');
            this.scene.start('SelectionMenuScene', { fromScene: this.sceneToPause });
        });

        this.noBtn.on('pointerdown', () => {
            this.scene.resume(this.sceneToPause);
            this.scene.stop('PauseMenu');
        });

        this.tweens.add({
            targets: [this.box, this.titleText, this.yesBtn, this.noBtn],
            alpha: { from: 0, to: 1 },
            duration: 400,
            ease: 'Sine.easeInOut'
        });
    }

    setPausedScene(sceneName) {
        this.sceneToPause = sceneName;
    }
}
