export class SelectionMenuScene extends Phaser.Scene {

    constructor() {
        super('SelectionMenuScene');
    }

    create(){

        const { width, height } = this.sys.game.canvas;

        this.add.text(width / 2,  height / 2 - 150, 'Selecciona tu juego', 
        {
            fontSize: '45px',
            fill: '#fff'
        }).setOrigin(0.5);

        const opciones = ['Era 1', 'Era 2', 'Era 3'];

        opciones.forEach((texto, i) => {
            const btn = this.add.text(width / 2, height / 2 - 30 + i * 80, texto, {
                fontSize: '35px',
                fill: 'rgba(0, 0, 0, 1)',
                backgroundColor: '#ffffffff',
                padding: { x: 20, y: 10 } 
            })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerover', () => btn.setStyle({ fill: 'rgba(92, 163, 255, 1)' }))
            .on('pointerout', () => btn.setStyle({ fill: 'rgba(0, 0, 0, 1)' }))
            .on('pointerdown', () => {
                this.scene.start('GameScene');
            });
                
            });

            const backBtn = this.add.text(width / 2, height / 2 + 250, 'Volver al inicio', {
                fontSize: '30px',
                fill: '#000000ff',
                backgroundColor: '#f7f7f7ff',
                padding: { x: 20, y: 10 }
            })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerover', () => backBtn.setStyle({ backgroundColor: '#bbbabaff' }))
            .on('pointerout', () => backBtn.setStyle({ backgroundColor: '#bbbabaff' }))
            .on('pointerdown', () => {
                this.scene.start('Start');
            });

        }
    }
