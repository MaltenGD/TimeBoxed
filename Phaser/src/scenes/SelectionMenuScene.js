export class SelectionMenuScene extends Phaser.Scene {
    constructor() {
        super('SelectionMenuScene');
    }

    create() {
        const { width, height } = this.sys.game.canvas;
        
        const centerX = width / 2;
        const centerY = height / 2;
        
        // La caja de momento será un rectángulo simple
        const box = this.add.rectangle(centerX, centerY, 200, 200, 0xffffff)
            .setStrokeStyle(4, 0x000000)
            .setInteractive({ cursor: 'pointer' })
            .setOrigin(0.5);
        

        const boxText = this.add.text(centerX, centerY, 'CAJA', {
            fontSize: '40px',
            fill: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Posiciones de los botones cuando salgan de la caja
        const buttonGap = 380; // Espacio entre los botones
        const finalPositions = [
            { x: centerX - buttonGap, y: centerY-100 },  // Egypt
            { x: centerX, y: centerY -100},              // Rome
            { x: centerX + buttonGap, y: centerY -100 }   // Japan
        ];

        const opciones = ['Egypt', 'Rome', 'Japan'];
        const scenes = ['AsebBeginScene', 'TaliBeginScene', 'HanafudaScene'];
        const buttons = [];
        
        // Se crean los botones pero se dejan ocultos hasta que se haga click en la caja
        opciones.forEach((opcion, index) => {
            const btn = this.add.text(centerX, centerY+150 , opcion, {
                fontSize: '35px',
                fill: 'rgba(0, 0, 0, 1)',
                backgroundColor: '#ffffff',
                padding: { top: 20, bottom: 400, x: 90 }
            })
            .setOrigin(0.5)
            .setAlpha(0)
            .setScale(0.1);
            
            buttons.push(btn);
        });

        const backBtn = this.add.text(200, height - 100, 'Volver al inicio', {
            fontSize: '30px',
            fill: '#000000',
            backgroundColor: '#f7f7f7',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ cursor: 'pointer' })
        .on('pointerover', () => backBtn.setStyle({ backgroundColor: '#bbbaba' }))
        .on('pointerout', () => backBtn.setStyle({ backgroundColor: '#f7f7f7' }))
        .on('pointerdown', () => {
            this.scene.start('Start');
        });

        // para controlar si ya salieron los botones y evitar que se repita la animación (solo se hará una vez)
        let deployed = false;

        // Esto ocurre cuando se hace click en la caja
        box.on('pointerdown', () => {
            if (deployed) return;
            deployed = true;

            // Se baja la caja abajo de la pantalla y se hace pequeña
            this.tweens.add({
                targets: [box, boxText],
                scale: 0.5,
                x: centerX, 
                y: centerY + 250,
                duration: 1600,
                ease: 'Back.easeOut'
            });

            // La animacion de los botones saliendo de la caja
            buttons.forEach((btn, index) => {
                this.tweens.add({
                    targets: btn,
                    x: finalPositions[index].x,
                    y: finalPositions[index].y,
                    alpha: 1,
                    duration: 1000,
                    ease: 'Sine.easeOut',
                    onComplete: () => { // Para que los botones solo se puedan pulsar cuando se termine la animación
                        btn.setInteractive({ cursor: 'pointer' })
                            .on('pointerover', () => btn.setStyle({ fill: 'rgba(92, 163, 255, 1)' }))
                            .on('pointerout', () => btn.setStyle({ fill: 'rgba(0, 0, 0, 1)' }))
                            .on('pointerdown', () => {
                                this.scene.start(scenes[index]);
                            });
                    }
                });

                this.tweens.add({ // He separado la animación de escala para tener mas control del resultado (quizas lo quite en el futuro)
                    targets: btn,
                    scale: 1,
                    duration: 2500,
                    ease: 'Sine.easeOut',
                    
                });

            });
        });

        // Efecto hover en la caja
        box.on('pointerover', () => {
            if (!deployed) {
                this.tweens.add({
                    targets: [box, boxText],
                    scale: 1.1,
                    duration: 200,
                    ease: 'Sine.easeOut'
                });
            }
        });

        box.on('pointerout', () => {
            if (!deployed) {
                this.tweens.add({
                    targets: [box, boxText],
                    scale: 1,
                    duration: 200,
                    ease: 'Sine.easeIn'
                });
            }
        });
    }
}