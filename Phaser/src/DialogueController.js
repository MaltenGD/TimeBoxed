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
        this.dialogBox = null;
        this.scene = scene;
        this.era = era;
        this.dialogueGroup = null;
        this.nextID = null;
        this.currentDialogue = null;
        this.dialogueData = dialogueData;
    }
   
    iniDialogue()
    {   
        if(this.era == 'Intro')
        {
            this.dialogueGroup = this.dialogueData.IntroDialogue;
        }

        this.dialogBox = new DialogBox(this.scene,
        {
            borderThickness: 4,
			borderColor: 0xcb3234,
			borderAlpha: 1,
			windowAlpha: 0.8,
			windowColor: 0x000000,
			windowHeight: 150,
			padding: 32,
			closeBtnColor: 'darkgoldenrod',
			dialogSpeed: 3,
			fontSize: 34,
            fontFamily: 'rimouski'
        });

        if (!this.dialogBox.visible) {
            this.dialogBox.toggleWindow();
        }

        this.currentDialogue = null;
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
        
        /**creates the dialogue with all the necessary parameters*/
        this.currentDialogue = new Dialogue(speaker, text, isAnimated);
        /**Shows dialogue on screen */
        this.showCurrentDialogue();

        /**sets the next ID to continue the dialogue */
        this.nextID = element.next;
    }


    handleInteraction()
    {   
        //When the player clicks while the text is animating, skip the animation
        if (this.dialogBox.isAnimating()) 
        {
            this.dialogBox.skipAnimation();
        } 
        // When the player clicks and the text is not animating, go to the next dialogue
        else if(this.nextID != null)
        {
            this.startDialogueBlock(this.nextID);
        }
        else 
        {
            this.endDialogueBlock();
        }
    }

    skipToEnd()
    {
        this.nextID = 'end';
        this.endDialogueBlock();
    }

    endDialogueBlock()
    {
        if(this.era == 'Intro')
        {
            this.scene.events.emit('IntroFinished');
        }
    }

    showCurrentDialogue() 
    {
        const dialogue = this.currentDialogue;
        const displayText = dialogue.speaker.name + ":\n" + dialogue.text;
        this.dialogBox.setText(displayText, dialogue.animated);
    }

    // this.introDialogues = 
    // [
    //     new Dialogue(player, '*Yawn* Today is a fuc-', true),
    //     new Dialogue(player, 'ehem, I mean, today is a great day to play.', true),
    //     new Dialogue(narrator, "You always start the morning with your yarn ball, it's ragged and old, but it's what makes the day awesome for you.", true),
    //     new Dialogue(narrator, "The sun is barely out and because you are such a wrecking ball of energy and noise and fluffy hair and cute ears (and whatever else you are), you wake up the whole neighborhood.", true),
    //     new Dialogue(narrator, "Humans yell at you from their windows, but you don't speak human, so you do not care at all.", true),
    //     new Dialogue(narrator, "This commotion and protagonist time of yours, catches the eye of a dark mysterious figure.", true),
    //     new Dialogue(narrator, "While you go crazy, time stops and a dark cat appears before you.\nYour instincs kick in and you stop playing to study the new creature before you.", true),
    //     new Dialogue(player, "mmm Excuse me, eh, good sir? Do you need something?", true), 
    //     new Dialogue(kronos, "*stares into the distance* oh Yes, you see there's a buch of meat in the corner of this alley.\nI was thinking if I should go eat it", true),
    //     new Dialogue(narrator, "At the mention of food, your brain knows no better than your stomach, both empty. You turn around naively all excited for food but find nothing.", true),
    //     new Dialogue(player, "That's weird, I don't see anything, sir.", true),

    //     new Dialogue(kronos, "*smirks* oh yeah, sorry I was thinking of a different alley. Anyway I see you're sooo intelligent my friend, so let's do this: you see this thing?", true),
    //     new Dialogue(narrator, "Kronos suddenly makes YOUR yarn ball appear next to him, while you were distracted he took the opportunity to stole it.", true),
    //     new Dialogue(player, "*in pure disbelief* YOU!! How do you have my yarn ball!?", true),
    //     new Dialogue(kronos, "Oh well the hows and whats aren't important here my friend, the thing is *pauses* I'm not giving it back to you MUAHAHA *evil laugh*.", true),
    //     new Dialogue(player, "you rat!... No, scratch that, you are even worse than a rat! \n give it back or else!", true),
    //     new Dialogue(kronos, "first, don't compare me to filthy rats. I'm above that AND above you too. But I'll let it slide this time. You see, I'm a really generous creature that means no harm. ", true),
    //     new Dialogue(kronos, "so I guess if you insist, I have no other option but to offer you a deal. Everything goes back to last week, when I accidentally and tragically lost my most priced belongings.", true),
    //     new Dialogue(kronos, "the thing is, I need someone to recover them. Don't worry it's only three objects, no biggie for something as smart as you.", true),
    //     new Dialogue(player, "why can't you do it yourself, if you want them back soooo badly?", true),
    //     new Dialogue(kronos, "because I can't, it's more complicated than that you peasant!", true),
    //     new Dialogue(player, "ugh, alr so what do I have to do to recover them so I can get my yarn back?", true),
    //     new Dialogue(kronos, "Pretty easy! you only have to win three games.", true),
    //     new Dialogue(player, "against you? and can I choose the games?\n (with all his ego I guess he will be an easy opponent).", true),
    //     new Dialogue(kronos, "Oh no no, you? playing against the almighty Kronos? no, no that can't be, I don't play with brats. Besides I don't have the objects duh if you win against me you would gain nothing.", true),
    //     new Dialogue(kronos, "*sighs* what you have to do is win against some of my *ehem* friends, who happened to recover them for me. However, for reasons you little brain won't understand I can't ask them to return them.", true),
    //     new Dialogue(kronos, "Anyway, win the games, I get my objects back and you get your beloved yarn. Do we have a deal?", true),
    //     new Dialogue(player, "(He seems shaddy, but I really want my yarn back ugh). Alr, we have a deal.", true),
    //     new Dialogue(narrator, "Kronos and you, paw with paw together and a there's a faint glow that goes away as fast as it came, this mean the deal has been sealed.", true),
    //     new Dialogue(kronos, "Well, it's done, but first you have to get with me in my box, this is how we will get around.", true),
    //     new Dialogue(player, "The box? how are we supposed to get around in that junk?", true),
    //     new Dialogue(kronos, "Oh, just shut it and get on!", true),
    //     new Dialogue(narrator, "you get in the box, and when you're inside it seems to have a lot more space that it appeared to have from the outside.", true),
    //     new Dialogue(kronos, "Well, welcome to my 'little' home haha. Now, because I'm the kindest cat around here, I'll let you choose where you wanna go first.", true),
    // ];
    // this.egyptDialogues = 
    // [
    //     new Dialogue(narrator, "With a jolt, the box shudders and then stills. The air is thick with the scent of sand and ancient dust.", true),
    //     new Dialogue(narrator, "You tumble out, blinking in the harsh desert sun, to find yourselves in a land of towering pyramids and colossal statues.", true),
    //     new Dialogue(player, "Whoa! Where are we now? This isn't exactly my alley.", true),
    //     new Dialogue(kronos, "Ah, my dear naive companion, welcome to the land of the pharaohs, the cradle of civilization, the... well, you get the idea. This is Egypt.", true),
    //     new Dialogue(player, "Egypt? So, is this where one of your 'friends' lives?", true),
    //     new Dialogue(kronos, "Indeed. Prepare yourself, since we are about to meet Anubis, the esteemed guardian of the underworld. He's... particular.", true),
    //     new Dialogue(player, "'Particular'? What does that even mean?", true),
    //     new Dialogue(kronos, "It means he has a rather *unfortunate* habit of judging my life choices. But I'm sure he'll be absolutely delighted to see us.", true),
    //     new Dialogue(narrator, "A deep, resonant voice echoes from behind a colossal statue of a jackal-headed deity. A figure emerges from the shadows, sleek and imposing, with eyes that seem to pierce through time itself.", true),
    //     new Dialogue(anubis, "Kronos. I had a feeling your... *unwise* endeavors would eventually lead you back to my domain.", true),
    //     new Dialogue(kronos, "Anubis, my old friend! Always a pleasure. And as sharp-tongued as ever, I see.", true),
    //     new Dialogue(anubis, "Pleasure is a concept lost on me when I witness such blatant disregard for valuable artifacts. You gambled away the Pin with Logo, did you not? A trinket of immense power, now reduced to a mere wager.", true),
    //     new Dialogue(player, "(A 'trinket of immense power'? What exactly did Kronos lose?)", true),
    //     new Dialogue(kronos, "Details, details, Anubis. It was a momentary lapse in judgment. A minor miscalculation. Nothing a quick game can't fix, eh?", true),
    //     new Dialogue(anubis, "Your 'miscalculations' are legendary, Kronos. And now you bring a... mortal cat to clean up your messes? How utterly predictable.", true),
    //     new Dialogue(player, "Hey! I'm not cleaning up his messes! I'm just trying to get my yarn ball back!", true),
    //     new Dialogue(anubis, "A yarn ball. How quaint. And you believe this... *deal* with Kronos will end favorably for you? He is the god of time, not of keeping promises.", true),
    //     new Dialogue(kronos, "Now, now, Anubis, let's not poison the well. The deal is sealed. And my young friend here is quite capable. He merely needs to win a game of Aseb to reclaim the Pin.", true),
    //     new Dialogue(anubis, "Aseb. A game of strategy, not reckless abandon. Very well. If this mortal can best me, the Pin is yours. But do not expect me to go easy, little one. The scales of justice are always balanced, even for a yarn ball.", true),
    //     new Dialogue(player, "(Balanced scales? This guy is serious. I better focus.)", true),
    //     new Dialogue(kronos, "Excellent! See, I told you he was reasonable. Now, let's get this show on the road!", true),
    //     new Dialogue(narrator, "Anubis gestures towards a nearby stone table, where an Aseb board is intricately carved. The air crackles with anticipation as the stage is set for the next challenge.", true),
    // ];
    // this.romeDialogues = [
    //     new Dialogue(kronos, 'Okay, I get it.', true),
    //     new Dialogue(player, 'But is this functionality going to stay like this?', true),
    //     new Dialogue(player, "No way. There are a lot of things that need to change.", true),
    //     new Dialogue(player, "They don't even have a loading screen yet.", true),
    //     new Dialogue(player, "Don't worry, pal. They're on the right track.", false),
    // ];
    // this.wipDialogues = [
    //     new Dialogue(kronos, '¿Estabas esperando encontrarte el juego en desarrollo?', true),
    //     new Dialogue(kronos, 'Nah bro, aquí no', true),
    //     new Dialogue(kronos, ':P', false)
    // ];
    // this.errorDialogues = [
    //     new Dialogue(kronos, 'Hey, you. Yes, you, the one writing the code.', true),
    //     new Dialogue(kronos, 'Double-check your recent call to the "start" method.', true),
    //     new Dialogue(kronos, 'You probably passed an incorrect parameter.', true),
    //     new Dialogue(kronos, 'See you later in the game!', true),
    // ];

}
