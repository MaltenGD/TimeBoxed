export class CreditsScene extends Phaser.Scene {
    constructor() {
        super('CreditsScene');
    }

    create() {
        const { width, height } = this.sys.game.canvas;

        this.cameras.main.setBackgroundColor('#000000');

        this.add.text(width / 2, height / 2 - 200, 'C R É D I T O S', {
            fontSize: '48px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2, 
            ' POPCAT\n\nTimeboxed:\n\nHola Grupo\nToñete', 
            {
                fontSize: '28px',
                fill: '#cccccc',
                align: 'center'
            }
        ).setOrigin(0.5);

        const backBtn = this.add.text(width / 2, height / 2 + 250, 'Volver al Inicio', {
            fontSize: '36px',
            fill: '#000000',
            backgroundColor: '#FFFFFF',
            padding: { x: 30, y: 15 }
        })
        .setOrigin(0.5)
        .setInteractive()
        
        .on('pointerover', () => backBtn.setStyle({ backgroundColor: '#e6e6e6' }))
        .on('pointerout', () => backBtn.setStyle({ backgroundColor: '#FFFFFF' }))
        .on('pointerdown', () => {
            this.scene.start('Start');
        });
    }
}
