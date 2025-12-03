import DialogueController from "../DialogueController.js";
import TransitionController, {RGBColor} from "../misc/transitioncontroller.js";
import { SkipButton } from "../SkipButton.js";
import { BaseScene } from "./BaseScene.js";

/**  
 *  @class Intro
 *  This class/scene shows the intro background and dialogues of the player meeting kronos
 */
export class Intro extends BaseScene 
{
    constructor() 
    {
        super('Intro');
    }

    
    create(playerData) 
    {

        this.playerData = playerData;
        this.playerData.StartedIntro = true;
        console.log(this.playerData)

        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition();

        // Get the canvas width and height to use when giving a position to an object
        let { width, height } = this.sys.game.canvas;


        //creating the background
        this.background = this.add.image(width / 2, height / 2, 'IntroBackgroundPlaceholder').setDisplaySize(width, height);

        this.backBtn = this.add.text(0, 0, 'Back', { fontSize: 64, fill: '#000000ff'})
        .setInteractive()
        .on('pointerover', () => this.backBtn.setStyle({fill: 'rgba(104, 35, 35, 1)'}))
        .on('pointerout', () => this.backBtn.setStyle({fill: '#000000ff'}))
        .on('pointerdown', () => {
            this.openOptionMenu();
        });
        
        //dialogues
        const introData = this.cache.json.get('IntroDialogue');
        this.dialogueController = new DialogueController(this, "Intro", introData);
        this.dialogueController.iniDialogue();

        /**Skip button */
        this.skipBtn = new SkipButton(this, width - 130, 50, this.dialogueController, this.playerData);
        
        this.events.on('nextDialog',()=>
        {
            this.dialogueController.handleInteraction();
        });

        this.events.on('Finished', () => {
            this.playerData.IntroCompleted = true
            this.transitionController.startFadeOutTransition(() => {
            this.scene.start('SelectionMenuScene', this.playerData);
                }, 400);
            console.log("cambia de escena");
        });

    }
        
}