import TransitionController from '../misc/transitioncontroller.js';
import { BaseScene } from './BaseScene.js';

export class CreditsScene extends BaseScene {
    constructor() {
        super('CreditsScene');
    }

    create(playerData) {
        this.playerData = playerData;
        this.DisableOptionMenu();

        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition();

        const { width, height } = this.sys.game.canvas;

        this.cameras.main.setBackgroundColor('#000000');

        this.add.text(width / 2, 160, 'CREDITS', {
            fontSize: '90px',
            fill: '#ffffff',
            strokeThickness:3
        }).setOrigin(0.5);

        this.add.text(width / 2, 260, 'POPCAT GAMES', {
            fontSize: '50px',
            fill: '#cccccc',
            strokeThickness:2
        }).setOrigin(0.5);

        // Miembros
        const members = [
            { name: 'Oliver Garcia', role: 'Programmer', role2: 'Artist', image: 'member1' },
            { name: 'Alicia Sarahi', role: 'Programmer', role2: 'Artist', image: 'member2' },
            { name: 'Zhiyi Zhou', role: 'Programmer', image: 'member3' },
            { name: 'Alexandra Lenta', role: 'Programmer', role2: 'Artist', image: 'member4' }
        ];

        const spacing = 320;
        const baseY = height / 2 + 190;
        const startX = width / 2 - ((members.length - 1) * spacing) / 2;

        this.activeBox = null;
        this.boxes = [];

        members.forEach((member, i) => {
            const x = startX + i * spacing;
            const box = this.add.container(x, baseY);

            const originalPositions = {
                containerY: baseY,
                portraitY: 0,
                nameTextY: 60,
                roleTextY: 85,
                roleText2Y: 120
            };

            const openPositions = {
                containerY: baseY - 150,
                portraitY: -210,
                nameTextY: 60 - 190, 
                roleTextY: 85 - 150,
                roleText2Y: 120 - 150
            };

            const boxClosed = this.add.image(0, 0, 'BoxClosed')
                .setOrigin(0.5)
                .setScale(0.75);

            const boxOpened = this.add.image(0, 0, 'BoxOpen')
                .setOrigin(0.5)
                .setScale(0.75)
                .setAlpha(0);

            const portrait = this.add.image(0, originalPositions.portraitY, member.image)
                .setDisplaySize(120, 120)
                .setAlpha(0);

            const nameText = this.add.text(0, originalPositions.nameTextY, member.name, {
                fontSize: '32px',
                fill: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5).setAlpha(0);

            const roleText = this.add.text(0, originalPositions.roleTextY, member.role, {
                fontSize: '30px',
                fill: '#ffffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5).setAlpha(0);

            const roleText2 = this.add.text(0, originalPositions.roleText2Y, member.role2, {
            fontSize: '28px',
            fill: '#ffffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0);

            box.add([boxClosed, boxOpened, portrait, nameText, roleText, roleText2]);

            // guardar referencias y posiciones
            box.boxClosed = boxClosed;
            box.boxOpened = boxOpened;
            box.portrait = portrait;
            box.nameText = nameText;
            box.roleText = roleText;
            box.roleText2 = roleText2;

            box.isOpen = false;
            
            // Guardar posiciones
            box.originalPositions = originalPositions;
            box.openPositions = openPositions;

            this.boxes.push(box);
            boxClosed.setInteractive({ useHandCursor: true })
                .on('pointerover', () => {
                    if (!box.isOpen) {
                        this.tweens.add({
                            targets: boxClosed,
                            scale: 0.8,
                            duration: 200,
                            ease: 'Sine.easeOut'
                        });
                    }
                })
                .on('pointerout', () => {
                    if (!box.isOpen) {
                        this.tweens.add({
                            targets: boxClosed,
                            scale: 0.75,
                            duration: 200,
                            ease: 'Sine.easeIn'
                        });
                    }
                })
                .on('pointerdown', () => this.toggleBox(box));

            boxOpened.setInteractive({ useHandCursor: true })
                .on('pointerdown', () => this.toggleBox(box));
        });

        // Back button
        const backBtn = this.add.image(220, height - 100, 'BackToStartNormal')
            .setOrigin(0.5)
            .setInteractive({ cursor: 'pointer' });

        backBtn.on('pointerover', () => { 
            this.sound.play('buttonHover', { volume: 2 * this.playerData.sfxVolume }); 
            backBtn.setTexture('BackToStartHovered');
            this.tweens.add({
                targets: backBtn,
                scale: 1.05,
                duration: 100,
                ease: 'Power1'
            });
        }).on('pointerout', () => {
            backBtn.setTexture('BackToStartNormal');
            this.tweens.add({
                targets: backBtn,
                scale: 1.0,
                duration: 150,
                ease: 'Power1'
            });
        }).on('pointerdown', () => {
            this.transitionController.startFadeOutTransition(() => {
                this.scene.start('Start', this.playerData);
            }, 400);
        });
    }

    toggleBox(box) {
        if (box.isOpen) {
            this.closeBox(box);
            this.activeBox = null;
        } else {
            if (this.activeBox && this.activeBox !== box) {
                this.closeBox(this.activeBox);
            }
            
            this.openBox(box);
            this.activeBox = box;
        }
    }

    openBox(box) {
        if (box.isOpen) return;
        box.isOpen = true;
        box.boxClosed.disableInteractive();

        this.tweens.add({
            targets: box,
            y: box.openPositions.containerY,
            duration: 200,
            ease: "Cubic.easeOut"
        });

        // Transition
        this.tweens.add({ 
            targets: box.boxClosed, 
            alpha: 0, 
            duration: 200 
        });
        
        this.tweens.add({ 
            targets: box.boxOpened, 
            alpha: 1, 
            duration: 200 
        });

        // Move image
        box.portrait.y = box.originalPositions.portraitY;
        this.tweens.add({
            targets: box.portrait,
            alpha: 1,
            y: box.openPositions.portraitY,
            duration: 200,
            ease: 'Cubic.easeOut',
            delay: 90
        });

        box.nameText.y = box.originalPositions.nameTextY;
        this.tweens.add({
            targets: box.nameText,
            alpha: 1,
            y: box.openPositions.nameTextY,
            duration: 200,
            ease: 'Cubic.easeOut',
            delay: 120
        });

        box.roleText.y = box.originalPositions.roleTextY;
        this.tweens.add({
            targets: box.roleText,
            alpha: 1,
            y: box.openPositions.roleTextY,
            duration: 200,
            ease: 'Cubic.easeOut',
            delay: 170
        });

        box.roleText2.y = box.originalPositions.roleText2Y;
        this.tweens.add({
            targets: box.roleText2,
            alpha: 1,
            y: box.openPositions.roleText2Y,
            duration: 200,
            ease: 'Cubic.easeOut',
            delay: 200
        });

        // escalar caja abierta
        this.tweens.add({
            targets: box.boxOpened,
            scale: 0.85,
            duration: 300,
            ease: 'Back.easeOut'
        });
    }

    closeBox(box) {
        if (!box.isOpen) return;
        box.isOpen = false;
        box.boxClosed.setInteractive();

        this.tweens.add({
            targets: box,
            y: box.originalPositions.containerY,
            duration: 200,
            ease: "Cubic.easeIn"
        });

        // Transition
        this.tweens.add({ 
            targets: box.boxClosed, 
            alpha: 1, 
            duration: 200 
        });
        
        this.tweens.add({ 
            targets: box.boxOpened, 
            alpha: 0, 
            duration: 200 
        });

        this.tweens.add({
            targets: box.portrait,
            alpha: 0,
            y: box.originalPositions.portraitY,
            duration: 200,
            ease: 'Cubic.easeIn'
        });

        this.tweens.add({
            targets: box.nameText,
            alpha: 0,
            y: box.originalPositions.nameTextY,
            duration: 200,
            ease: 'Cubic.easeIn'
        });

        this.tweens.add({
            targets: box.roleText,
            alpha: 0,
            y: box.originalPositions.roleTextY,
            duration: 200,
            ease: 'Cubic.easeIn'
        });
        this.tweens.add({
        targets: box.roleText2,
        alpha: 0,
        y: box.originalPositions.roleText2Y,
        duration: 200,
        ease: 'Cubic.easeIn'
    });

        // Regresar escala de caja
        this.tweens.add({
            targets: box.boxOpened,
            scale: 0.75,
            duration: 300,
            ease: 'Back.easeIn'
        });
    }
}