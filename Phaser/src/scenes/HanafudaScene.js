export class HanafudaScene extends Phaser.Scene {
    constructor() {
        super('HanafudaScene');
    }

    preload() {
        
    }

    create() {
        let {width, height } = this.sys.game.canvas;
        let text = this.add.text(width/2, height/2 - 100, "Hanafuda Scene", {fontSize: 64}).setOrigin(0.5);

        this.add.text(width / 2, height / 2, "Our cats are still figuring out the rules...", {
        fontSize: 28,
        fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 - 200, "🚧 Hanafuda in construction 🚧", {
        fontSize: 48,
        fill: '#ff5555'
        }).setOrigin(0.5);

        this.backBtn = this.add.text(0, 0, 'Back', { fontSize: 64, fill: '#fff'})
        .setInteractive()
        .on('pointerover', () => this.backBtn.setStyle({fill: '#0f0'}))
        .on('pointerdown', () => {
        if (this.scene.isActive('PauseMenu')) return;
        this.scene.launch('PauseMenu');
        const pauseMenu = this.scene.get('PauseMenu');
        pauseMenu.setPausedScene(this.scene.key);
        this.scene.pause();
        })
        .on('pointerout', () => this.backBtn.setStyle({fill: '#fff'}));
    }
}