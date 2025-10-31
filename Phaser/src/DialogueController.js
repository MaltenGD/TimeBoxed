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
        const game = new Speaker('game');
        // const anubis = new Speaker('Anubis');
        // const mercury = new Speaker('Mercury');
        // const benten = new Speaker('Benten');

        this.introDialogues = 
        [
            new Dialogue(player, '*Yawn* Today is a fuc-', true),
            new Dialogue(player, 'ehem, I mean, today is a great day to play.', true),
            new Dialogue(game, "You always start the morning with your yarn ball, it's ragged and old, but it's what makes the day awesome for you.", true),
            new Dialogue(game, "The sun is barely out and because you are such a wrecking ball of energy and noise and fluffy hair and cute ears (and whatever else you are), you wake up the whole neighborhood.", true),
            new Dialogue(game, "Humans yell at you from their windows, but you don't speak human, so you do not care at all.", true),
            new Dialogue(game, "This commotion and protagonist time of yours, catches the eye of a dark mysterious figure.", true),
            new Dialogue(game, "While you go crazy, time stops and a dark cat appears before you.\nYour instincs kick in and you stop playing to study the new creature before you.", true),
            new Dialogue(player, "mmm Excuse me, eh, good sir? Do you need something?", true), 
            new Dialogue(kronos, "*stares into the distance* oh Yes, you see there's a buch of meat in the corner of this alley.\nI was thinking if I should go eat it", true),
            new Dialogue(game, "At the mention of food, your brain knows no better than your stomach, both empty. You turn around naively all excited for food but find nothing", true),
            new Dialogue(player, "That's weird, I don't see anything, sir", true),

            new Dialogue(kronos, "*smirks* oh yeah, sorry I was thinking of a different alley. Anyway I see you're sooo intelligent my friend, so let's do this: you see this thing?", true),
            new Dialogue(game, "Kronos suddenly makes YOUR yarn ball appear next to him, while you were distracted he took the opportunity to stole it", true),
            new Dialogue(player, "*in pure disbelief* YOU!! How do you have my yarn ball!?", true),
            new Dialogue(kronos, "Oh well the hows and whats aren't important here my friend, the thing is *pauses* I'm not giving it back to you MUAHAHA *evil laugh*", true),
            new Dialogue(player, "you rat!... No, scratch that, you are even worse than a rat! \n give it back or else!", true),
            new Dialogue(kronos, "first, don't compare me to filthy rats. I'm above that AND above you too. But I'll let it slide this time. You see, I'm a really generous creature that means no harm ", true),
            new Dialogue(kronos, "so I guess if you insist, I have no other option but to offer you a deal. Everything goes back to last week, when I accidentally and tragically lost my most priced belongings", true),
            new Dialogue(kronos, "the thing is, I need someone to recover them. Don't worry it's only three objects, no biggie for something as smart as you", true),
            new Dialogue(player, "why can't you do it yourself, if you want them back soooo badly?", true),
            new Dialogue(kronos, "because I can't, it's more complicated than that you peasant!", true),
            new Dialogue(player, "ugh, alr so what do I have to do to recover them so I can get my yarn back?", true),
            new Dialogue(kronos, "pretty easy! you only have to win three games", true),
            new Dialogue(player, "against you? and can I choose the games?\n ('with all his ego I guess he will be an easy opponent')", true),
            new Dialogue(kronos, "oh no no, you? playing against the almighty Kronos? no, no that can't be, I don't play with brats. Besides I don't have the objects duh if you win against me you would gain nothing", true),
            new Dialogue(kronos, "*sighs* what you have to do is win against some of my ehem friends, who happened to recover them for me. However, for reasons you little brain won't understand I can't ask them to return them", true),
            new Dialogue(kronos, "Anyway, win the games, I get my objects back and you get your beloved yarn. Do we have a deal?", true),
            new Dialogue(player, "(He seems shaddy, but I really want my yarn back ugh). Alr, we have a deal", true),
            new Dialogue(game, "Kronos and you, paw with paw together and a there's a faint glow that goes away as fast as it came, this mean the deal has been sealed", true),
            new Dialogue(kronos, "Well, it's done, but first you have to get with me in my box, this is how we will get to where we need to go ", true),
            new Dialogue(player, "the box? how are we supposed to get around in that?", true),
            new Dialogue(kronos, "oh, just shut it and get on!", true),
            new Dialogue(game, "you get in the box, and when you're inside it seems to have a lot more space that it appeared to have from the outside", true),
            new Dialogue(kronos, "Well, welcome to my little home haha. Now, because I'm the kindest cat around here, I'll let you choose where you wanna go first", true),



            new Dialogue(kronos, "oh yeah, sorry I was thinking of a different alley", true),

        ];
        this.egyptDialogues = 
        [
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
        this.wipDialogues = [
            new Dialogue(kronos, '¿Estabas esperando encontrarte el juego en desarrollo?', true),
            new Dialogue(kronos, 'Nah bro, aquí no', true),
            new Dialogue(kronos, ':P', false)
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
            case 'WIP':
                this.dialogues = this.wipDialogues;
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
            if (this.currentDialogueIndex < this.dialogues.length) 
            {
                this.showCurrentDialogue();
            } 
            else 
            {
                if (this.dialogBox.visible) 
                {
                    this.dialogBox.toggleWindow();
                }
                
                if(this.dialogues == this.introDialogues)
                {
                    this.scene.events.emit('IntroFinished');

                    console.log('blkweh');
                }
               
                console.log('Final del bloque de dialogo.');
            }
        }
    }

    showCurrentDialogue(narrator = false) {
        const dialogue = this.dialogues[this.currentDialogueIndex];
        const displayText = dialogue.speaker.name + ":\n" + dialogue.text;
        this.dialogBox.setText(displayText, dialogue.animated);
    }

}
