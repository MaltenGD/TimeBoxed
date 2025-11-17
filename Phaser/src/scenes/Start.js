import TransitionController from "../misc/transitioncontroller.js";
import { ConfirmMenuScene } from "./ConfirmMenuScene.js";

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
        this.firstAccess = true;
    }



    /**
     * Crea los elemnetos visuales e interactivos de la escena
     * @method create
     * @param {object} playerData 
     */
    create(playerData) {

        console.log('playerData:', Object.keys(playerData).length);

        if (Object.keys(playerData).length == 0) // La primera vez que se inicia el juego (PlayerData es vacío)
        {
            const cached = this.cache.json.get('playerData');
            this.playerData = cached;
        }
        else this.playerData = playerData

       
        

        console.log('playerData:', this.playerData);

        let { width, height } = this.sys.game.canvas;

        if (this.playerData.TimeboxedMode) this.background = this.add.image(width / 2, height / 2, 'backgroundTB').setDisplaySize(width, height);
        else this.background = this.add.image(width / 2, height / 2, 'background').setDisplaySize(width, height);

        this.tController = new TransitionController(this);

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
            }).setOrigin(0.5)
            .setInteractive();

        this.TimeboxedButton = this.add.text(1500, 900, '',
            {
                fontSize: '30px',
                fill: '#000000',
                backgroundColor: '#ffffffff',
                padding: { x: 40, y: 40 },
                
            }).setOrigin(0.5)
            .setInteractive();
        if (this.playerData.TimeboxedMode) this.TimeboxedButton.setText('   DISABLE\nTIMEBOXED MODE')
        else this.TimeboxedButton.setText('   ENABLE\nTIMEBOXED MODE')

        

        //PLAY BUTTON INTERACTIONS

        //efecto hover del boton play
        playButton.on('pointerover', () => {
            playButton.setFrame(1);
        });
        playButton.on('pointerout', () => {
            playButton.setFrame(0);
        });

        //accion click
        playButton.on('pointerup', () => {
            this.tController.startFadeOutTransition(() => this.scene.start('Intro', this.playerData), 400);
        });

        //CREDITS BUTTON INTERACTIONS

        //efecto hover del boton Creditos
        creditsButton.on('pointerover', () => creditsButton.setStyle({ fill: '#62a6ffff' }));
        creditsButton.on('pointerout', () => creditsButton.setStyle({ fill: '#000000ff' }));

        //efecto hover del boton Timeboxed
        this.TimeboxedButton.on('pointerover', () => this.TimeboxedButton.setStyle({ fill: '#62a6ffff' }));
        this.TimeboxedButton.on('pointerout', () => this.TimeboxedButton.setStyle({ fill: '#000000ff' }));

        //accion click
        creditsButton.on('pointerdown', () => {

            this.scene.start('CreditsScene');
        });
        
        this.TimeboxedButton.on('pointerdown', () => {

            if (this.playerData.showedTBwarn == true)
            {
                this.changeTimeboxedMode(!this.playerData.TimeboxedMode);
            }
            else{

            

            if (this.scene.isActive('ConfirmMenu')) return;

            this.scene.pause();
            this.scene.launch('ConfirmMenu',{
                sceneToPause: this.scene.key,
                text: "Are you sure you want to activate TimeBoxed mode?\n\n When playing with this enabled, if you lose any game, the entire game will restart. \nCompleting the entire game in this mode will grant an exclusive achievement",
                onYes: () => {
                    this.scene.resume(this);
                    this.scene.stop('ConfirmMenu');
                
                    this.changeTimeboxedMode(true);
                    this.playerData.showedTBwarn = true;
                },
                onNo: () => {
                    this.scene.resume(this);
                    this.scene.stop('ConfirmMenu');
                }
            });

            }

          
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

    changeTimeboxedMode(state)
    {

        this.playerData.TimeboxedMode = state;
        console.log(this.playerData)
        if (state)  
        {
            this.TimeboxedButton.setText("   DISABLE\nTIMEBOXED MODE");
            this.background.setTexture("backgroundTB")
        }
        else 
        {
            this.TimeboxedButton.setText("   ENABLE\nTIMEBOXED MODE");
            this.background.setTexture("background")
        }

    }



}
