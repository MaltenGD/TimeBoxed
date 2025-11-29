import DialogueController from "../DialogueController.js";
import TransitionController, {RGBColor} from "../misc/transitioncontroller.js";
import { BaseScene } from "./BaseScene.js";

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
        console.log(this.playerData)
        // Get the canvas width and height to use when giving a position to an object
        let { width, height } = this.sys.game.canvas;

        this.DisableOptionMenu();

        this.transitionController = new TransitionController(this);
        this.transitionController.startFadeInTransition();

        //creating the background
        this.background = this.add.image(width / 2, height / 2, 'backgroundTB').setDisplaySize(width, height);

        /**Skip button */
        const skipBtn = this.add.text(width - 100, height - 1000 , 'SKIP', {
            fontSize: '30px',
            fill: '#000000',
            backgroundColor: '#f7f7f7',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ cursor: 'pointer' })
        .on('pointerover', () => skipBtn.setStyle({ backgroundColor: '#bbbaba' }))
        .on('pointerout', () => skipBtn.setStyle({ backgroundColor: '#f7f7f7' }))
        .on('pointerdown', () => {
            this.dialogueController.skipToEnd();
        });

        /** variable json*/
        const TBdefeatDialogue = this.cache.json.get('TimeBoxedDefeatDialogue');
        this.dialogueController = new DialogueController(this, "TimeBoxedDefeat", TBdefeatDialogue);
        this.dialogueController.iniDialogue();
        
        this.events.on('nextDialog',()=>
        {
            this.dialogueController.handleInteraction();
        });

        this.events.on('Finished', () => {

            this.resetPlayerData();
            this.scene.start('Start', this.playerData);
            console.log("cambia de escena");
        });
    
    }
    openOptionMenu()
    {
        if (this.scene.isActive('OptionMenu')) return;
            this.scene.pause();
            this.scene.launch('OptionMenu', { sceneToPause: this.scene.key });
    }

    resetPlayerData()
    {
        for (const key in this.playerData) {
            if (typeof this.playerData[key] === 'boolean') {
                this.playerData[key] = false;
            }
        }

    }
            
}
