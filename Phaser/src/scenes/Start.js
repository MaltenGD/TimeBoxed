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


        const box = this.add.image(300, 950, 'BoxOpen').setOrigin(0.5).setScale(1.5).setRotation(0.2);

        // a constant wobbling effect as if the box was floating on space
        this.tweens.add({
            targets: box,
            y: 930,
            duration: 4000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            loop: -1
        });
        const kitty = this.add.image(500, 450, 'StartMenuKronos').setOrigin(0.5).setScale(0.9);

        this.tweens.add({
            targets: kitty,
            y: 520,
            duration: 5000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            loop: -1
        });

        const logo = this.add.image(1300, 150, 'logo').setOrigin(0.5);

        // Define final positions for the letters
        const letterSpacing = 100;
        const normalPositions = {
            S: { x: -2 * letterSpacing - 20 , y: 0 },
            T1: { x: -1 * letterSpacing - 20, y: 0 },
            A: { x: -20, y: 0 },
            R: { x: letterSpacing + 40, y: 0 },
            T2: { x: 3 * letterSpacing + 40, y: 0 }
        };

        // letter images
        const playButtonS = this.add.image(normalPositions.S.x, normalPositions.S.y, 'playButtonS').setOrigin(0.5)
        const playButtonT = this.add.image(normalPositions.T1.x, normalPositions.T1.y, 'playButtonT').setOrigin(0.5)
        const playButtonA = this.add.image(normalPositions.A.x, normalPositions.A.y, 'playButtonA').setOrigin(0.5)
        const playButtonR = this.add.image(normalPositions.R.x, normalPositions.R.y, 'playButtonR').setOrigin(0.5)
        const playButtonT2 = this.add.image(normalPositions.T2.x, normalPositions.T2.y, 'playButtonT2').setOrigin(0.5)

        this.wanderingTweens = [];
        this.startWandering(playButtonS, playButtonT, playButtonA, playButtonR, playButtonT2, normalPositions);


        const playButton = this.add.container(width / 2 + 200, height - 200, [playButtonS, playButtonT, playButtonA, playButtonR, playButtonT2]).setSize(600, 150).setInteractive();
        //boton de creditos
        const creditsButton = this.add.image( width - 150, height - 150, 'creditsButton').setOrigin(0.5).setScale(0.15).setInteractive();

        //PLAY BUTTON INTERACTIONS
        this.arranged = false;
        //efecto hover del boton play
        playButton.on('pointerover', () => {
            if (this.arranged) return;
            
            this.sound.play('buttonHover', { volume: 2 * this.playerData.sfxVolume });


            // Stop wandering tweens
            this.wanderingTweens.forEach(tween => tween.stop());

            // Rearrange letters
            this.tweens.add({
                targets: playButtonS,
                x: normalPositions.S.x,
                y: normalPositions.S.y,
                duration: 500,
                ease: 'Power2'
            });
            this.tweens.add({
                targets: playButtonT,
                x: normalPositions.T1.x,
                y: normalPositions.T1.y,
                duration: 500,
                ease: 'Power2'
            });
            this.tweens.add({
                targets: playButtonA,
                x: normalPositions.A.x,
                y: normalPositions.A.y,
                duration: 500,
                ease: 'Power2'
            });
            this.tweens.add({
                targets: playButtonR,
                x: normalPositions.R.x,
                y: normalPositions.R.y,
                duration: 500,
                ease: 'Power2'
            });
            this.tweens.add({
                targets: playButtonT2,
                x: normalPositions.T2.x,
                y: normalPositions.T2.y,
                duration: 500,
                ease: 'Power2',
                onComplete: () => {
                    this.arranged = true;
                }
            });

            
        });

        playButton.on('pointerout', () => {
            if (!this.arranged) return;

            // Restart the wandering with new random destinations
            this.startWandering(playButtonS, playButtonT, playButtonA, playButtonR, playButtonT2, normalPositions);

            this.arranged = false;
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
            this.tweens.add({
                targets: creditsButton,
                scale: 0.17,
                duration: 200,
                ease: 'Sine.easeInOut',
                yoyo: false,
            });
        });
        creditsButton.on('pointerout', () => {
            this.tweens.add({
                targets: creditsButton,
                scale: 0.15,
                duration: 200,
                ease: 'Sine.easeInOut',
                yoyo: false,
            });
           
        });

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

    /**
     * Starts the wandering animation for the START button letters.
     * It removes any existing wandering tweens and creates new ones with random destinations.
     * @param {Phaser.GameObjects.Image} playButtonS 
     * @param {Phaser.GameObjects.Image} playButtonT 
     * @param {Phaser.GameObjects.Image} playButtonA 
     * @param {Phaser.GameObjects.Image} playButtonR 
     * @param {Phaser.GameObjects.Image} playButtonT2 
     * @param {object} normalPositions 
     */
    startWandering(playButtonS, playButtonT, playButtonA, playButtonR, playButtonT2, normalPositions) {
        // Last tweens need to be removed first.
        this.wanderingTweens.forEach(tween => tween.remove());
        this.wanderingTweens = [];

        const letters = [
            { target: playButtonS, pos: normalPositions.S },
            { target: playButtonT, pos: normalPositions.T1 },
            { target: playButtonA, pos: normalPositions.A },
            { target: playButtonR, pos: normalPositions.R },
            { target: playButtonT2, pos: normalPositions.T2 }
        ];

        letters.forEach(letter => {
            const newTween = this.tweens.add({
                targets: letter.target,
                x: letter.pos.x + Phaser.Math.Between(-5, 5),
                y: letter.pos.y + 20,
                duration: Phaser.Math.Between(2000, 4000),
                ease: 'Sine.easeInOut',
                yoyo: true,
                loop: -1
            });
            this.wanderingTweens.push(newTween);
        });
    }


}
