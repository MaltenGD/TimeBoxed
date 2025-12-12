
/**
 * @class SkipButton
 * A UI component that allows skipping a dialogue sequence.
 */
export class SkipButton extends Phaser.GameObjects.Image {

    /**
     * @param {Phaser.Scene} scene The scene to add the button to.
     * @param {number} x The x-coordinate of the button.
     * @param {number} y The y-coordinate of the button.
     * @param {DialogueController} dialogueController The controller for the dialogue to be skipped.
     * @param {object} playerData The player's data, containing sfxVolume.
     */
    constructor(scene, x, y, dialogueController, playerData) {
        super(scene, x, y, 'SkipButtonNormal');

        this.dialogueController = dialogueController;
        this.playerData = playerData;

        this.setOrigin(1,0)
            .setScale(0.5)
            .setInteractive({ cursor: 'pointer' });

        this.on('pointerover', this.handlePointerOver, this);
        this.on('pointerout', this.handlePointerOut, this);
        this.on('pointerdown', this.handlePointerDown, this);

        // Add this game object to the scene
        scene.add.existing(this);
    }

    /**
     * Handles the pointer over event, showing a hover effect.
     */
    handlePointerOver() {
        this.setTexture('SkipButtonHovered');
        this.scene.sound.play('buttonHover', { volume: 2 * this.playerData.sfxVolume });
        this.scene.tweens.add({
            targets: this,
            scale: 0.55,
            duration: 100,
            ease: 'Power1'
        });
    }

    /**
     * Handles the pointer out event, reverting to the normal state.
     */
    handlePointerOut() {
        this.setTexture('SkipButtonNormal');
        this.scene.sound.play('buttonHover', { volume: 2 * this.playerData.sfxVolume });
        this.scene.tweens.add({
            targets: this,
            scale: 0.5,
            duration: 100,
            ease: 'Power1'
        });
    }

    /**
     * Handles the pointer down event, skipping the dialogue.
     */
    handlePointerDown() {
        this.dialogueController.skipToEnd();
    }
}