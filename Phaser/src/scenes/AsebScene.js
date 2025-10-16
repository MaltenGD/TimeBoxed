export class AsebScene extends Phaser.Scene {
    constructor() {
        super('AsebScene');
    }

    preload() {
        
    }

    create() {
        let {width, height } = this.sys.game.canvas;
        let text = this.add.text(width/2, height/2, "Aseb Scene", {fontSize: 64}).setOrigin(0.5);
        this.backBtn = this.add.text(0, 0, 'Back', { fontSize: 64, fill: '#fff'})
        .setInteractive()
        .on('pointerover', () => this.backBtn.setStyle({fill: '#0f0'}))
        .on('pointerdown', () => this.scene.start('SelectionMenuScene', { counterTxt: this.counterTxt }))
        .on('pointerout', () => this.backBtn.setStyle({fill: '#fff'}));
    }
}