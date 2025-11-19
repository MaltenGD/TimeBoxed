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
        this.isTutorial = false;

        /** @property ID of the next dialogue to be shown */
        this.nextID = null;

        /** @property current dialogue being shown */
        this.currentDialogue = null;
    }
   
    /**
     * @method iniDialogue initializes the dialogue sequence
    */
    iniDialogue()
    {   

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
        else if (this.era == 'TimeBoxedDefeat')
        {
            this.dialogueGroup = this.dialogueData.TimeBoxedDefeatDialogue;
        }
        

        /**creates the dialog box */
        this.dialogBox = new DialogBox(this.scene,
        {
            borderThickness: 6,
			borderColor: 0xcb3234,
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
        this.scene.events.emit('Finished');
    }

    /**
     * @method showCurrentDialogue displays the current dialogue in the dialog box
     */
    showCurrentDialogue() 
    {
        const dialogue = this.currentDialogue;
        const displayText = dialogue.speaker.name + ":\n" + dialogue.text;
        this.dialogBox.setText(displayText, dialogue.animated);
    }
}
