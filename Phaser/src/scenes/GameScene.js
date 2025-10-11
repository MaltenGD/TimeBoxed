export class GameScene extends Phaser.Scene {

    constructor() {
        super('GameScene');
        this.counterTxt = 0;
    }

    preload() {
        this.canvas = this.sys.game.canvas;
    }

    create() {
        let { width, height } = this.sys.game.canvas;

        let countText = this.add.text(width / 2, height / 2, this.counterTxt, { fontSize: 64 }).setOrigin(0.5);

        this.counterBtn = this.add.text(width / 2, height / 2 + countText.height * 2, 'Click me!', { fontSize: 64, fill: '#0f0'}).setOrigin(0.5)
        .setInteractive()
        .on('pointerover', () => this.counterBtn.setStyle({fill: '#0ff'}))
        .on('pointerdown', () => countText.setText(++this.counterTxt))
        .on('pointerout', () => this.counterBtn.setStyle({fill: '#0f0'}));

        this.backBtn = this.add.text(0, 0, 'Back', { fontSize: 64, fill: '#fff'})
        .setInteractive()
        .on('pointerover', () => this.backBtn.setStyle({fill: '#0f0'}))
        .on('pointerdown', () => this.scene.start('SelectionMenuScene', { counterTxt: this.counterTxt }))
        .on('pointerout', () => this.backBtn.setStyle({fill: '#fff'}));
    }
}