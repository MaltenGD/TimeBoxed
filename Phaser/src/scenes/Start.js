export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
    this.load.image('background', 'Phaser/assets/space.png');
    this.load.image('logo', 'Phaser/assets/titlelogo.png');
    this.load.spritesheet('playButton', 'Phaser/assets/playButton.png', { frameWidth: 186, frameHeight: 92 });

    }

    create() {
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');

        const logo = this.add.image(640, 150, 'logo');
        const playButton = this.add.sprite(640, 500, 'playButton', 0).setInteractive();

        playButton.on('pointerover', () => {
            playButton.setFrame(1);
        });
        
        playButton.on('pointerout', () => {
            playButton.setFrame(0);
        });

        playButton.on('pointerup', () => { // This method will change to another scene (not created yet)
            this.scene.start('SelectionMenuScene');
        });
        logo.setScale(0.5);

        this.tweens.add({
            targets: logo,
            y: 200,
            duration: 1800,
            ease: 'Sine.easeInOut',
            yoyo: true,
            loop: -1
        });

    }

    update() {
        this.background.tilePositionX += 0.3;
    }
    
}
