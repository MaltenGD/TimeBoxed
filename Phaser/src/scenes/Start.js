/**
 * @file Start.js
 * @description Escena inicial del juego. Desde aqui el jugador puede incial la partida 
 * y ver los creditos
 */

export class Start extends Phaser.Scene {

    /**
     * Crea una nueva instancia de la escena Start
     * @constructor
     */
    constructor() {
        super('Start');
    }

    /**
     * Carga imagenes y logos utilizados en la pantalla inicial
     * @method preload
     */
    preload() {
        this.load.image('background', 'Phaser/assets/StartMenu/MainBackground.png');
        this.load.image('taliBackgroundPlaceholder', 'Phaser/assets/tali/taliBackgroundPlaceholder.png');
        this.load.image('StartMenuKronos', 'Phaser/assets/StartMenu/kittykronos.png')
        this.load.image('BoxOpen', 'Phaser/assets/StartMenu/cardboardbox.png')
        this.load.image('logo', 'Phaser/assets/titlelogo.png');
        this.load.image('teamLogo', 'Phaser/assets/teamLogo.png');
        this.load.spritesheet('playButton', 'Phaser/assets/playButton.png', { frameWidth: 186, frameHeight: 92 });

    }

    /**
     * Crea los elemnetos visuales e interactivos de la escena
     * @method create
     * @param {object} data 
     */
    create(data) {
        let { width, height } = this.sys.game.canvas;
        this.background = this.add.image(width / 2, height / 2, 'background').setDisplaySize(width, height);

        const box = this.add.image(400, 950, 'BoxOpen').setOrigin(0.5).setScale(1.5);
        const kitty = this.add.image(500, 450, 'StartMenuKronos').setOrigin(0.5).setScale(0.9);

        this.tweens.add({
            targets: kitty,
            y: 620,
            duration: 3000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            loop: -1
        });

        const logo = this.add.image(1300, 150, 'logo').setOrigin(0.5);
        const playButton = this.add.sprite(1150, 900, 'playButton', 0).setInteractive().setOrigin(0.5).setScale(1.4);

        //boton de creditos
        const creditsButton = this.add.text(1150, 750, 'CREDITS',
            {
                fontsize: '36px',
                fill: '#000000',
                backgroundColor: '#ffffffff',
                padding: { x: 40, y: 20 }
            })

            .setOrigin(0.5)
            .setInteractive();

        // let counterValue = data.counterTxt !== undefined ? data.counterTxt : 0;
        // this.counterDisplay = this.add.text(width / 2, height / 2, `Counter: ${counterValue}`, { fontSize: 64 }).setOrigin(0.5);

        //PLAY BUTTON INTERACTIONS

        //efecto hover del boton play
        playButton.on('pointerover', () => {
            playButton.setFrame(1);
        });
        playButton.on('pointerout', () => {
            playButton.setFrame(0);
        });

        //accion click
        playButton.on('pointerup', () => { // This method will change to another scene (not created yet)
            this.scene.start('LoadingScene');
        });

        //CREDITS BUTTON INTERACTIONS

        //efecto hover del boton Creditos
        creditsButton.on('pointerover', () => creditsButton.setStyle({ fill: '#62a6ffff' }));
        creditsButton.on('pointerout', () => creditsButton.setStyle({ fill: '#000000ff' }));

        //accion click
        creditsButton.on('pointerdown', () => {

            this.scene.start('CreditsScene');
        });

        logo.setScale(0.5);

        //animacion del nombre del juego
        this.tweens.add({
            targets: logo,
            y: 200,
            duration: 1800,
            ease: 'Sine.easeInOut',
            yoyo: true,
            loop: -1
        });

        //Logo del equipo en la esquina
        const teamLogo = this.add.image(width - 100, height - 100, 'teamLogo')
            .setOrigin(0.5)
            .setScale(0.15)
        //.setAlpha(0.9);
        //.setTint(0xffffffff);


    }



}
