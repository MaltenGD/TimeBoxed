import DialogueController from "../../DialogueController.js";

export class IntroAseb extends Phaser.Scene
{
    constructor(){super('IntroAseb');}

    preload()
    {

        /** Load the json file for the Intro Dialogue 
        * @param {string} key - The key to reference the loaded JSON data.
        * @param {string} url - The URL of the JSON file to load.
        */
        this.load.json('AsebIntroDialogue', 'Phaser/DialoguesJson/EgyptDialogue.json');
    }

    create() 
    {
        // Get the canvas width and height to use when giving a position to an object
        let { width, height } = this.sys.game.canvas;

        //creating the background
        this.background = this.add.image(width / 2, height / 2, 'asebBackgroundPlaceholder').setDisplaySize(width, height);

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
        const introAsebData = this.cache.json.get('AsebIntroDialogue');
        this.dialogueController = new DialogueController(this, "Aseb", introAsebData);
        this.dialogueController.iniDialogue();
        
        this.events.on('nextDialog',()=>
        {
            this.dialogueController.handleInteraction();
        });

        this.events.on('Finished', () => {
            this.scene.start('AsebBeginScene');
            console.log("cambia de escena");
        });
    
    }
            
}
