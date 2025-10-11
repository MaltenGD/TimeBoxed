export class SelectionMenuScene extends Phaser.Scene {

    constructor() {
        super('SelectionMenuScene');
    }

    create(){

        const { width, height } = this.sys.game.canvas;

        this.add.text(width / 2, 100, 'Selecciona tu juego', 
        {
            fontSize: '45px',
            fill: '#fff'
        }).setOrigin(0.5);

        const opciones = ['Juego 1', 'Juego 2', 'Juego 3'];

        opciones.forEach((texto, i) => {
            const btn = this.add.text(width / 2, 200 + i * 100, texto, {
                fontSize: '32px',
                fill: '#0f0'
            })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerover', () => btn.setStyle({ fill: '#0ff' }))
            .on('pointerout', () => btn.setStyle({ fill: '#0f0' }))
            .on('pointerdown', () => {
                this.scene.start('GameScene');
            });
        });
    }


}