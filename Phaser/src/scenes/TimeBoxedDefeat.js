import DialogueController from "../DialogueController.js";
import TransitionController, {RGBColor} from "../misc/transitioncontroller.js";
import { BaseScene } from "./BaseScene.js";
import { SkipButton } from "../SkipButton.js";

export class TimeBoxedDefeat extends BaseScene
{
    constructor(){super('TimeBoxedDefeat');}

    preload()
    {

        /** Load the json file for the Intro Dialogue 
        * @param {string} key - The key to reference the loaded JSON data.
        * @param {string} url - The URL of the JSON file to load.
        */
        this.load.json('TimeBoxedDefeatDialogue', 'Phaser/DialoguesJson/TimeBoxedDefeatDialogue.json');
    }

    create(playerData) 
    {
        this.playerData = playerData;
        this.resetPlayerData();
        console.log(this.playerData)
        // Get the canvas width and height to use when giving a position to an object
        let { width, height } = this.sys.game.canvas;
        this.DisableOptionMenu();

         const baseMusicVolume = 0.25;
            this.music = this.sound.add('Emptyness', { loop: true, volume: baseMusicVolume * this.playerData.musicVolume });
            this.soundInstances.push({ 
                sound: this.music, 
                type: 'music', 
                baseVolume: baseMusicVolume 
            });
            this.music.play();



        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition(() => {}, 2000);

        //creating the background
        this.background = this.add.image(width / 2, height / 2, 'backgroundTB').setDisplaySize(width, height);


        /** variable json*/
        const TBdefeatDialogue = this.cache.json.get('TimeBoxedDefeatDialogue');
        this.dialogueController = new DialogueController(this, "TimeBoxedDefeat", TBdefeatDialogue);
        this.dialogueController.iniDialogue();

        /**Skip button */
                this.skipBtn = new SkipButton(this, width - 130, 50, this.dialogueController, this.playerData);
        
        this.events.on('nextDialog',()=>
        {
            this.dialogueController.handleInteraction();
        });

        this.events.on('Finished', () => {

            this.transitionController.startFadeOutTransition(() => {
            this.scene.start('Start', this.playerData);
            console.log("El juego se reinicia");
                }, 2700);
           
        });
    
    }

    resetPlayerData()
    {
        for (const key in this.playerData) {
            if (typeof this.playerData[key] === 'boolean' && key !== 'DebugMode') {
                this.playerData[key] = false;
            }
        }

    }
            
}
