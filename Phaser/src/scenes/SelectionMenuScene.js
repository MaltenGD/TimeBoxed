/**
 * SelectionMenuScene class shows in the different levels of the game, so the player can choose
 */

export class SelectionMenuScene extends Phaser.Scene {
    constructor() {
        super('SelectionMenuScene');
    }

    create() {
        const { width, height } = this.sys.game.canvas;  //width and height of the canvas
        
        const centerX = width / 2;
        const centerY = height / 2;
        
        // The box, from where the 3 levels appear, for now is a plain rectangle
        const box = this.add.rectangle(centerX, centerY, 200, 200, 0xffffff)
            .setStrokeStyle(4, 0x000000)
            .setInteractive({ cursor: 'pointer' })
            .setOrigin(0.5);
        

        const boxText = this.add.text(centerX, centerY, 'CAJA', {
            fontSize: '40px',
            fill: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Position of the buttons when they're out of the box
        const buttonGap = 380; // Space between buttons
        const finalPositions = [
            { x: centerX - buttonGap, y: centerY-100 },  // Egypt
            { x: centerX, y: centerY -100},              // Rome
            { x: centerX + buttonGap, y: centerY -100 }   // Japan
        ];

        /** array of string for the levels */
        const opciones = ['Egypt', 'Rome', 'Japan'];

        /** array of string for the each level scene*/
        const scenes = ['AsebBeginScene', 'TaliBeginScene', 'HanafudaScene'];

        /** Array for buttons */
        const buttons = [];
        
        // Levels Buttons creation but they aren't showed until the box is clicked
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

        /** Button to go back to the Start scene */
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

        /** It controls if the buttons are showing/deployed in screen so their animation doesn't reapeat again (it's used only 1 time)*/
        let deployed = false;

        // When the box is clicked the follwoing happens:
        
        box.on('pointerdown', () => {
            if (deployed) return;
            deployed = true;

            // The box shrinks and goes to the bottom of the canvas
            this.tweens.add({
                targets: [box, boxText],
                scale: 0.5,
                x: centerX, 
                y: centerY + 250,
                duration: 1600,
                ease: 'Back.easeOut'
            });

            // Buttons coming our of the box animation

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

        // Box hover effect
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