export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background', 'Phaser/assets/space.png');
        this.load.image('logo', 'Phaser/assets/titlelogo.png');
        this.load.image('teamLogo', 'Phaser/assets/teamLogo.png');
        this.load.spritesheet('playButton', 'Phaser/assets/playButton.png', { frameWidth: 186, frameHeight: 92 });
    }

    create(data) {
        let { width, height } = this.sys.game.canvas;
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');
        
        const logo = this.add.image(width/2, 150, 'logo').setOrigin(0.5);
        const playButton = this.add.sprite(width/2, 500, 'playButton', 0).setInteractive().setOrigin(0.5);
        
        const creditsButton = this.add.text(width/2, 600, 'CREDITS',
            {
                fontsize:'36px',
                fill: '#000000',
                backgroundColor: '#ffffffff',
                padding: {x:40,y:20}
            })

            .setOrigin(0.5)
            .setInteractive();

        // let counterValue = data.counterTxt !== undefined ? data.counterTxt : 0;
        // this.counterDisplay = this.add.text(width / 2, height / 2, `Counter: ${counterValue}`, { fontSize: 64 }).setOrigin(0.5);

        playButton.on('pointerover', () => {
            playButton.setFrame(1);
        });
        
        playButton.on('pointerout', () => {
            playButton.setFrame(0);
        });

        playButton.on('pointerup', () => { // This method will change to another scene (not created yet)
            this.scene.start('SelectionMenuScene');
        });

        creditsButton.on('pointerover', () => creditsButton.setStyle({ fill: '#62a6ffff' }));

        creditsButton.on('pointerout', () => creditsButton.setStyle({ fill: '#000000ff' }));

        creditsButton.on('pointerdown', () => {

            this.scene.start('CreditsScene');
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

         const teamLogo = this.add.image(width - 20, height - 20, 'teamLogo')
            .setOrigin(1, 1)
            .setScale(0.1)
            //.setAlpha(0.9);
            //.setTint(0xffffffff);


    }

    update() {
        this.background.tilePositionX += 0.3;
    }
    
}
