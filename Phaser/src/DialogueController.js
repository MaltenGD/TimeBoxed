import Dialogue from './Dialogue.js';
import Speaker from './Speaker.js';
import DialogBox from './dialog_plugin.js';

/**
 * @class DialogueController
 * This class stores and manages all the dialogues in the game
 */
export default class DialogueController
{
    constructor(scene, era, dialogueData) 
    {
        /**@property Is the box on which the speaker and dialogue appears */
        this.dialogBox = null;

        /**@property Is scene on which the dialogues will appear */
        this.scene = scene;

        /**@property era the dialogue corresponds of */
        this.era = era;

        /** @property dialogue data from json file */
        this.dialogueData = dialogueData;

        /** @property object that holds the dialogues objects from the json file*/
        this.dialogueGroup = null;

        /** @property ID of the next dialogue to be shown */
        this.nextID = null;

        /** @property current dialogue being shown */
        this.currentDialogue = null;

        /** @property {Phaser.Sound.BaseSound} sound for the dialogue text animation */
        this.dialogueTextSound = null;

        this.dialogueTextVolume = 0.15;
    }
   
    /**
     * @method iniDialogue initializes the dialogue sequence
    */
    iniDialogue()
    {   
        this.scene.events.on('shutdown', this.shutdown, this);

        this.scene.events.on('pause', this.pause, this);
        this.scene.events.on('resume', this.resume, this);

        this.scene.events.removeListener('nextDialog');
        this.scene.events.removeListener('Finished');
        this.scene.events.removeListener('changeTutoImage');
        
        // Reset dialogue state to prevent skipping issues
        this.nextID = null;
        this.currentDialogue = null;

        // Add the sound for the dialogue text
        this.dialogueTextSound = this.scene.sound.add('DialogueTextSFX', { loop: true , volume: this.dialogueTextVolume * this.scene.playerData.sfxVolume});

        if(this.era == 'Intro')
        {
            this.dialogueGroup = this.dialogueData.IntroDialogue;
        }
        else if(this.era == 'Aseb')
        {
            this.dialogueGroup = this.dialogueData.EgyptDialogue;
        }
        else if(this.era == 'AsebTutorial')
        {
            this.dialogueGroup = this.dialogueData.AsebTutorialDialogue;
            this.isTutorial = true;
        }
        else if (this.era == 'AsebWin')
        {
            this.dialogueGroup = this.dialogueData.AsebWinDialogue;
        }
        else if (this.era == 'AsebDefeat')
        {
            this.dialogueGroup = this.dialogueData.AsebDefeatDialogue;
        }
        else if (this.era == 'Tali') {
            this.dialogueGroup = this.dialogueData.TaliIntroDialogue;
        }
        else if (this.era == 'TaliWin') {
            this.dialogueGroup = this.dialogueData.TaliWinDialogue;
        }
        else if (this.era == 'TaliLose') {
            this.dialogueGroup = this.dialogueData.TaliLoseDialogue;
        }
        else if (this.era == 'TaliTutorial') {
            this.dialogueGroup = this.dialogueData.TaliTutorialDialogue;
        }
        else if (this.era == 'DM0') {
            this.dialogueGroup = this.dialogueData.DistractMercuryDialogue0;
        }
        else if (this.era == 'DM1') {
            this.dialogueGroup = this.dialogueData.DistractMercuryDialogue1;
        }
        else if (this.era == 'DM2') {
            this.dialogueGroup = this.dialogueData.DistractMercuryDialogue2;
        }
        else if (this.era == 'DM3') {
            this.dialogueGroup = this.dialogueData.DistractMercuryDialogue3;
        }
        else if (this.era == 'DM4') {
            this.dialogueGroup = this.dialogueData.DistractMercuryDialogue4;
        }
        else if (this.era == 'TimeBoxedDefeat')
        {
            this.dialogueGroup = this.dialogueData.TimeBoxedDefeatDialogue;
        }
        else if (this.era == 'GameCompleted')
        {
            this.dialogueGroup = this.dialogueData.GameCompletedDialogue;
        }
        

        const borderColor = this.scene.playerData.TimeboxedMode ? 0xcb3234 : 0x0055CC;

        /**creates the dialog box */
        this.dialogBox = new DialogBox(this.scene,
        {
            borderThickness: 6,
			borderColor: borderColor,
			borderAlpha: 1,
			windowAlpha: 0.8,
			windowColor: 0x000000,
			windowHeight: 150,
			padding: 32,
			closeBtnColor: 'darkgoldenrod',
			dialogSpeed: 3.5,
			fontSize: 34,
            fontFamily: 'rimouski',
            radius: 20
        });

        /**Initially hide the dialog box */
        if (!this.dialogBox.visible) {
            this.dialogBox.toggleWindow();
        }


        /**starts the dialogue block */
        this.startDialogueBlock('start');
    }

    /**
     * @method startDialogueBlock advances to the next dialogue in the sequence.
    */
    startDialogueBlock(keyID)
    {
        /**gets the dialogue object*/
        const element = this.dialogueGroup[keyID];

        if(!element)
        {
            console.log("Dialogue ended or next ID is invalid.");
            return; 
        }

        //Gets the elements speaker, text and animation from the dialogue object
        /**creates the speaker */
        const speaker = new Speaker(element.speaker);
        /**gets the text */
        const text = element.text;
        /**gets if the dialogue is animated */
        const isAnimated = element.animation === 'true';

        const imageKey = element.image;
        if(imageKey)
        {
            this.scene.events.emit('changeTutoImage', imageKey);
        }
        
        /**creates the dialogue with all the necessary parameters*/
        this.currentDialogue = new Dialogue(speaker, text, isAnimated);
        /**Shows dialogue on screen */
        this.showCurrentDialogue();

        /**sets the next ID to continue the dialogue */
        this.nextID = element.next;
    }

    /** 
     * @method handleInteraction handles the interaction when the player clicks to advance the dialogue
     */
    handleInteraction()
    {   
        // When the player clicks and the text is not animating, go to the next dialogue
        if(this.nextID != null)
        {
            this.startDialogueBlock(this.nextID);
        }
        else 
        {
            this.endDialogueBlock();
        }
    }

    /**
     * @method skipToEnd next dialogue is set to 'end' to finish the dialogue block
     */
    skipToEnd()
    {
        this.nextID = 'end';
        this.endDialogueBlock();
    }

    /**
     * @method endDialogueBlock emits an event saying the dialogue block is at the end
     */
    endDialogueBlock()
    {
        this.fadeOutSound();
        this.scene.events.emit('Finished');
    }

    fadeOutSound(duration = 400) {
        // If the dialogue text sound is playing, fade it out
        if (this.dialogueTextSound && this.dialogueTextSound.isPlaying) {
            this.scene.tweens.add({
                targets: this.dialogueTextSound,
                volume: 0,
                duration: duration,
                ease: 'Linear',
                onComplete: () => {
                    this.dialogueTextSound.stop();
                }
            });
        }
    }

    /**
     * @method showCurrentDialogue displays the current dialogue in the dialog box
     */
    showCurrentDialogue() 
    {
        const dialogue = this.currentDialogue;
        const displayText = dialogue.speaker.name + ":\n" + dialogue.text;
        this.dialogBox.setText(displayText, dialogue.animated);

        if (dialogue.animated) {
            if (this.dialogueTextSound && !this.dialogueTextSound.isPlaying) {
                this.dialogueTextSound.play();
            }
            
            this.scene.events.once('typingComplete', () => {
                if (this.dialogueTextSound && this.dialogueTextSound.isPlaying) {
                    this.dialogueTextSound.stop();
                }
            });
        }
    }

    /**
     * @method shutdown cleans up resources when the scene is shut down
     */
    shutdown() {
        if (this.dialogueTextSound) {
            this.dialogueTextSound.stop();
        }
        this.scene.events.removeListener('shutdown', this.shutdown, this);
    }

    /**
     * @method pause handles scene pause events
     */
    pause() {
        if (this.dialogueTextSound && this.dialogueTextSound.isPlaying) {
            this.dialogueTextSound.pause();
        }
    }

    /**
     * @method resume handles scene resume events
     */
    resume() {
        // Update volume in case it was changed in the options menu
        this.dialogueTextSound.setVolume(this.dialogueTextVolume * this.scene.playerData.sfxVolume);

        // Only resume the sound if it was paused.
        // This prevents the sound from starting on resume if it wasn't playing before.
        if (this.dialogueTextSound && this.dialogueTextSound.isPaused) {
            this.dialogueTextSound.resume();
        }
    }
}
