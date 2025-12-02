/**
 * @file SettingsScene.js
 * @description A scene for adjusting game settings like volume. (The createSlider method is made by AI, Perdón Toni :c)
 */
export class SettingsScene extends Phaser.Scene {
    constructor() {
        super('SettingsScene');
    }

    init(data) {
        this.fromScene = data.fromScene;
        this.playerData = data.playerData;
    }

    create() {
        let { width, height } = this.sys.game.canvas;

        this.mainColor = this.playerData.TimeboxedMode ? 0xAA0000 : 0x0055CC

        // Semi-transparent background
        this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0);

        // Settings container
        const settingsContainer = this.add.container(width / 2, height / 2);

        // Settings Title
        const title = this.add.text(0, -200, 'Settings', { fontSize: '64px', fill: '#ffffff', fontFamily: 'rimouski'}).setOrigin(0.5);
        settingsContainer.add(title);

        // Music Volume
        const musicLabel = this.add.text(-150, -100, 'Music Volume', { fontSize: '32px', fill: '#ffffff', fontFamily: 'rimouski'}).setOrigin(0, 0.5);
        const musicSlider = this.createSlider(-150, -50, this.playerData.musicVolume, (value) => {
            this.playerData.musicVolume = value;
        });
        settingsContainer.add([musicLabel, musicSlider]);

        // SFX Volume
        const sfxLabel = this.add.text(-150, 50, 'SFX Volume', { fontSize: '32px', fill: '#ffffff', fontFamily: 'rimouski'}).setOrigin(0, 0.5);
        const sfxSlider = this.createSlider(-150, 100, this.playerData.sfxVolume, (value) => {
            this.playerData.sfxVolume = value;
            // Play a sound to test the new volume
            if (!this.testSound || !this.testSound.isPlaying) {
                this.testSound = this.sound.add('buttonHover');
                this.testSound.play({ volume: this.playerData.sfxVolume });
            }
        });
        settingsContainer.add([sfxLabel, sfxSlider]);

        // Back Button
        const backButton = this.add.image(0, 250, 'SettingsBackButton').setOrigin(0.5).setScale(0.2).setInteractive();


        this.input.keyboard.once('keydown-ESC', () => {
            this.scene.stop();
            this.scene.resume(this.fromScene);
        });

        backButton.on('pointerover', () => {
            this.sound.play('buttonHover', { volume: 2 * this.playerData.sfxVolume });
            this.tweens.add({
                targets: backButton,
                scale: 0.24 ,
                duration: 150,
                ease: 'Sine.easeInOut',
                yoyo: false,
            });
        });
        backButton.on('pointerout', () => {
            this.tweens.add({
                targets: backButton,
                scale: 0.2,
                duration: 150,
                ease: 'Sine.easeInOut',
                yoyo: false,
            });
        });
        backButton.on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume(this.fromScene);
        });
        settingsContainer.add(backButton);

    }

    /**
     * Creates a simple slider UI component.
     * @param {number} x - The x position.
     * @param {number} y - The y position.
     * @param {number} initialValue - The initial value of the slider (0-1).
     * @param {function} callback - The function to call when the value changes.
     * @returns {Phaser.GameObjects.Container} A container with the slider elements.
     */
    createSlider(x, y, initialValue, callback) {
        const sliderWidth = 300;
        const sliderHeight = 20;

        const container = this.add.container(x, y);

        const track = this.add.rectangle(0, 0, sliderWidth, sliderHeight, 0x444444).setOrigin(0, 0.5);
        const handle = this.add.rectangle(sliderWidth * initialValue, 0, 20, 40, 0xffffff).setOrigin(0.5).setInteractive();
        handle.setData('value', initialValue);

        const valueText = this.add.text(sliderWidth + 30, 0, Math.round(initialValue * 100), { fontSize: '24px', fill: '#ffffff' , fontFamily: 'rimouski'}).setOrigin(0, 0.5);

        container.add([track, handle, valueText]);

        this.input.setDraggable(handle);

        handle.on('drag', (pointer, dragX) => {
            const newX = Phaser.Math.Clamp(dragX, 0, sliderWidth);
            handle.x = newX;
            
            const value = newX / sliderWidth;
            handle.setData('value', value);
            valueText.setText(Math.round(value * 100));
            
            callback(value);
        });

        return container;
    }
}