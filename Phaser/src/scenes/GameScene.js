export class GameScene extends Phaser.Scene {

    constructor() {
        super('GameScene');
    }

    preload() {
        this.canvas = this.sys.game.canvas;
    }

    create() {
        let { width, height } = this.sys.game.canvas;

        let counterTxt = 0;
        let countText = this.add.text(width / 2, height / 2, counterTxt, { fontSize: 64 }).setOrigin(0.5)

        this.counterBtn = this.add.text(width / 2, height / 2 + countText.height * 2, 'Click me!', { fontSize: 64, fill: '#0f0'}).setOrigin(0.5)
        .setInteractive()
        .on('pointerover', () => this.counterBtn.setStyle({fill: '#0ff'}))
        .on('pointerdown', () => countText.setText(++counterTxt))
        .on('pointerout', () => this.counterBtn.setStyle({fill: '#0f0'}));
    }
    
}