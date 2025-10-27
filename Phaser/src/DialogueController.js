import Dialogue from './Dialogue.js';
import Speaker from './Speaker.js';
import DialogBox from './dialog_plugin.js';

/**
 * @class DialogueController
 * This class stores and manages all the dialogues in the game
 */
export default class DialogueController{
    constructor() {

        this.currentDialogueIndex = 0;
        this.dialogBox = null;
        this.scene = null;
        this.introDialogues = [];
        this.egyptDialogues = [];
        this.romeDialogues = [];
        this.japanDialogues = [];
        this.dialogues = [];
    }

    /**
     * Initializes the dialogue controller and sets up the dialogues.
     */
    init() {
        
        // Se crean las variables Speaker.
        const kronos = new Speaker('Kronos');
        const player = new Speaker('Player');
        // const anubis = new Speaker('Anubis');
        // const mercury = new Speaker('Mercury');
        // const benten = new Speaker('Benten');

        this.introDialogues = [
            new Dialogue(kronos, 'It seems that this dialogue system is working', true),
            new Dialogue(player, 'It sure does.', true),
            new Dialogue(kronos, 'Good. Oliver will explain the rest to you.', true)
        ];
        this.egyptDialogues = [
            new Dialogue(kronos, 'Wait, what?', true),
            new Dialogue(kronos, "They've already learned how to use this system?", true),
            new Dialogue(player, 'Yeah, they called the "start" method with "Egypt" as the parameter.', true)
        ];
        this.romeDialogues = [
            new Dialogue(kronos, 'Okay, I get it.', true),
            new Dialogue(player, 'But is this functionality going to stay like this?', true),
            new Dialogue(player, "No way. There are a lot of things that need to change.", true),
            new Dialogue(player, "They don't even have a loading screen yet.", true),
            new Dialogue(player, "Don't worry, pal. They're on the right track.", false),
        ];
        this.errorDialogues = [
            new Dialogue(kronos, 'Hey, you. Yes, you, the one writing the code.', true),
            new Dialogue(kronos, 'Double-check your recent call to the "start" method.', true),
            new Dialogue(kronos, 'You probably passed an incorrect parameter.', true),
            new Dialogue(kronos, 'See you later in the game!', true),
        ];


        
    }
   
    /**
     * Starts a dialogue block (each era has its own block) (array) from the beginning.
     */
    start(scene, era) {

        switch (era) {

            case 'Intro':
                this.dialogues = this.introDialogues;
                break;
            case 'Egypt':
                this.dialogues = this.egyptDialogues;
                break;
            case 'Rome':
                this.dialogues = this.romeDialogues;
                break;
            case 'Japan':
                this.dialogues = this.japanDialogues;
                break;
            default:
                this.dialogues = this.errorDialogues;
                break;
        }
        this.scene = scene;

        // Create the UI Box
        this.dialogBox = new DialogBox(this.scene,
            {
            borderThickness: 4,
			borderColor: 0xcb3234,
			borderAlpha: 1,
			windowAlpha: 0.6,
			windowColor: 0xff6961,
			windowHeight: 150,
			padding: 32,
			closeBtnColor: 'darkgoldenrod',
			dialogSpeed: 3,
			fontSize: 34,
            fontFamily: 'rimouski'
            }
        );

        if (!this.dialogBox.visible) {
            this.dialogBox.toggleWindow();
        }
        this.currentDialogueIndex = 0;
        this.showCurrentDialogue();
    }

    /**
     * Advances to the next dialogue in the sequence.
     */
    handleInteraction(){
        if (this.dialogBox.isAnimating()) {
            this.dialogBox.skipAnimation();
        } 
        else {
            ++this.currentDialogueIndex;
            if (this.currentDialogueIndex < this.dialogues.length) {
                this.showCurrentDialogue();
            } else {
                if (this.dialogBox.visible) {
                    this.dialogBox.toggleWindow();
                }
                console.log('Final del bloque de dialogo.');
            }
        }
    }

    showCurrentDialogue() {
        const dialogue = this.dialogues[this.currentDialogueIndex];
        const displayText = dialogue.speaker.name + ":\n" + dialogue.text;
        this.dialogBox.setText(displayText, dialogue.animated);
    }
}
