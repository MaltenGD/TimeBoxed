import TransitionController from "../misc/transitioncontroller.js";
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


        const box = this.add.image(300, 1050, 'BoxOpen').setOrigin(0.5).setScale(1.75).setRotation(0.2);

        // a constant wobbling effect as if the box was floating on space
        this.tweens.add({
            targets: box,
            y: 1030,
            duration: 4000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            loop: -1
        });

        const kitty = this.add.image(350, 450, 'StartMenuKronos').setOrigin(0.5).setScale(0.82);

        this.tweens.add({
            targets: kitty,
            y: 520,
            duration: 4500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            loop: -1
        });

        const timepiece = this.add.image(240, 260, 'Timepiece').setOrigin(0.5).setScale(0.9);

        this.tweens.add({
            targets: timepiece,
            y: 380,
            duration: 5500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            loop: -1
        });

        const logoOriginalX = (width / 2) - 125;
        const logoOriginalY = 125;
        const logoTargetY = 150;
        const logo = [
            this.add.image(logoOriginalX, logoOriginalY, 'T').setOrigin(0.5).setScale(0.8),
            this.add.image(logoOriginalX + 45, logoOriginalY, 'I').setOrigin(0.5).setScale(0.8),
            this.add.image(logoOriginalX + 120, logoOriginalY, 'M').setOrigin(0.5).setScale(0.8),
            this.add.image(logoOriginalX + 220, logoOriginalY, 'E').setOrigin(0.5).setScale(0.8),
            this.add.image(logoOriginalX + 320, logoOriginalY, 'B').setOrigin(0.5).setScale(0.8),
            this.add.image(logoOriginalX + 430, logoOriginalY, 'O').setOrigin(0.5).setScale(0.8),
            this.add.image(logoOriginalX + 555, logoOriginalY, 'X').setOrigin(0.5).setScale(0.8),
            this.add.image(logoOriginalX + 700, logoOriginalY, 'E2').setOrigin(0.5).setScale(0.8),
            this.add.image(logoOriginalX + 860, logoOriginalY, 'D').setOrigin(0.5).setScale(0.8)
        ]
        .forEach((letter, index) => {
            this.tweens.add({
                targets: letter,
                y: logoTargetY,
                duration: 3000,
                ease: 'Sine.easeInOut',
                delay: index * 150,
                yoyo: true,
                loop: -1
            });
        });

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

        const startLetters = [
            { letter: playButtonS, key: 'S', pos: normalPositions.S },
            { letter: playButtonT, key: 'T', pos: normalPositions.T1 },
            { letter: playButtonA, key: 'A', pos: normalPositions.A },
            { letter: playButtonR, key: 'R', pos: normalPositions.R },
            { letter: playButtonT2, key: 'T2', pos: normalPositions.T2 }
        ];

        this.wanderingTweens = [];
        this.arrangementTweens = [];
        this.startWandering(startLetters);
        const playButton = this.add.container(width / 2 + 200, height - 200, [playButtonS, playButtonT, playButtonA, playButtonR, playButtonT2]).setSize(600, 150).setInteractive();
        //boton de creditos
        const settingsButton = this.add.image( width - 125, height - 225, 'StartMenuSettings').setOrigin(0.5).setScale(0.12).setInteractive();
        const creditsButton = this.add.image( width - 125, height - 100, 'creditsButton').setOrigin(0.5).setScale(0.12).setInteractive();

        //PLAY BUTTON INTERACTIONS
        this.arranged = false;
        //efecto hover del boton play
        playButton.on('pointerover', () => {
            if (this.arranged) return;
            
            this.sound.play('buttonHover', { volume: 2 * this.playerData.sfxVolume });

            // Stop wandering tweens
            this.wanderingTweens.forEach(tween => tween.stop());
            this.wanderingTweens = [];

            // Change textures to hovered version
            startLetters.forEach(item => item.letter.setTexture(`playButton${item.key}Hovered`));
            
            // Rearrange letters
            this.arrangementTweens.forEach(tween => tween.remove());
            this.arrangementTweens = [];

            startLetters.forEach((item, index) => {
                const tween = this.tweens.add({
                    targets: item.letter,
                    x: item.pos.x,
                    y: item.pos.y,
                    duration: 500,
                    ease: 'Power2',
                    onComplete: (index === startLetters.length - 1) ? () => { this.arranged = true; } : null
                });
                this.arrangementTweens.push(tween);
            });
        });

        playButton.on('pointerout', () => {
            // Stop any arranging tweens immediately
            this.arrangementTweens.forEach(tween => tween.stop());
            this.arrangementTweens = [];

            // Revert textures to normal
            startLetters.forEach(item => item.letter.setTexture(`playButton${item.key}`));

            // Restart the wandering with new random destinations
            this.startWandering(startLetters);

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
                scale: 0.14,
                duration: 200,
                ease: 'Sine.easeInOut',
                yoyo: false,
            });
        });
        creditsButton.on('pointerout', () => {
            this.tweens.add({
                targets: creditsButton,
                scale: 0.12,
                duration: 200,
                ease: 'Sine.easeInOut',
                yoyo: false,
            });
           
        });

        settingsButton.on('pointerover', () => {
            settingsButton.setTexture('StartMenuSettingsHovered');
            this.sound.play('buttonHover', { volume: 2 * this.playerData.sfxVolume });
            this.tweens.add({
                targets: settingsButton,
                scale: 0.14,
                duration: 200,
                ease: 'Sine.easeInOut',
                yoyo: false,
            });
        }).on('pointerout', () => {
            settingsButton.setTexture('StartMenuSettings');
            this.tweens.add({
                targets: settingsButton,
                scale: 0.12,
                duration: 200,
                ease: 'Sine.easeInOut',
                yoyo: false,
            });
           
        }).on('pointerdown', () => {
            this.scene.pause();
            this.scene.launch('SettingsScene', {
                fromScene: 'Start',
                playerData: this.playerData
            });
        });



        //accion click
        creditsButton.on('pointerdown', () => {

             this.transitionController.startFadeOutTransition(() => {
                
               this.scene.start('CreditsScene');
            
            }, 200);
            
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
     * It stops any existing wandering tweens and creates new ones.
     * @param {Array<object>} letters - Array of letter objects to animate.
     */
    startWandering(letters) {
        this.wanderingTweens.forEach(tween => tween.stop());
        this.wanderingTweens = [];

        letters.forEach(letter => {
            const newTween = this.tweens.add({
                targets: letter.letter,
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
