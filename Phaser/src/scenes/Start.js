import TransitionController from "../misc/transitioncontroller.js";
import { ConfirmMenuScene } from "./ConfirmMenuScene.js";
import { BaseScene } from "./BaseScene.js";

/**
 * @file Start.js
 * @description Escena inicial del juego. Desde aqui el jugador puede incial la partida 
 * y ver los creditos
 */
export class Start extends BaseScene {

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

        // This scene does not use the options menu, so we remove the listener.
        // Note: super.create() is not called, so the listener is never added.
        // If it were, we would use: this.input.keyboard.removeListener('keydown-ESC');

        console.log('playerData:', Object.keys(playerData).length);

        this.DisableOptionMenu();

        if (Object.keys(playerData).length == 0) // La primera vez que se inicia el juego (PlayerData es vacío)
        {
            const cached = this.cache.json.get('playerData');
            this.playerData = cached;
        }
        else this.playerData = playerData

        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition();

        this.sound.unlock();
        // Background music
            const baseMusicVolume = 0.3;
            this.music = this.sound.add('startMenuMusic', { loop: true, volume: baseMusicVolume * this.playerData.musicVolume });
            this.soundInstances.push({ 
                sound: this.music, 
                type: 'music', 
                baseVolume: baseMusicVolume 
            });
            this.music.play();
        

        // Unlock audio on the first user interaction
        this.sound.pauseOnBlur = false; // Keep audio playing even when the window loses focus.
        
       
        

        console.log('playerData:', this.playerData);

        let { width, height } = this.sys.game.canvas;

        if (this.playerData.TimeboxedMode) this.background = this.add.image(width / 2, height / 2, 'backgroundTB').setDisplaySize(width, height);
        else this.background = this.add.image(width / 2, height / 2, 'background').setDisplaySize(width, height);


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



        

        //PLAY BUTTON INTERACTIONS

        //efecto hover del boton play
        playButton.on('pointerover', () => {
            this.sound.play('buttonHover', { volume: 2 * this.playerData.sfxVolume });
            playButton.setFrame(1);
        });
        playButton.on('pointerout', () => {

            playButton.setFrame(0);
        });

        //accion click
        playButton.on('pointerup', () => {
            this.transitionController.startFadeOutTransition(() => {
                this.KillSounds();
                if (this.playerData.IntroCompleted) {
                    this.scene.start('SelectionMenuScene', this.playerData);
                } else if (this.playerData.StartedIntro) {
                    this.scene.start('Intro', this.playerData);
                }
                else {
                     if (this.scene.isActive('GameModeSelection')) return;
                    
                    this.scene.pause('Start');
                    this.scene.launch('GameModeSelection', { PausedScene: 'Start', playerData: this.playerData });
                }
            }, 400);
        });

        //CREDITS BUTTON INTERACTIONS

        //efecto hover del boton Creditos
        creditsButton.on('pointerover', () => {
            this.sound.play('buttonHover', { volume: 2 * this.playerData.sfxVolume });
            creditsButton.setStyle({ fill: '#62a6ffff' })
    
        });
        creditsButton.on('pointerout', () => creditsButton.setStyle({ fill: '#000000ff' }));

    

        //accion click
        creditsButton.on('pointerdown', () => {

             this.transitionController.startFadeOutTransition(() => {
                
               this.scene.start('CreditsScene');
            
            }, 200);
            
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
