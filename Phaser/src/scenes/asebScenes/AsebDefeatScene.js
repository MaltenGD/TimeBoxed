import DialogueController from "../../DialogueController.js";

export class AsebDefeatScene extends Phaser.Scene
{
    constructor(){super('AsebDefeatScene');}

    preload()
    {

        /** Load the json file for the Intro Dialogue 
        * @param {string} key - The key to reference the loaded JSON data.
        * @param {string} url - The URL of the JSON file to load.
        */
        this.load.json('AsebDefeatDialogue', 'Phaser/DialoguesJson/AsebDefeatDialogue.json');
    }

    create(playerData) 
    {
        this.playerData = playerData;
        console.log(this.playerData)
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
        const introAsebData = this.cache.json.get('AsebDefeatDialogue');
        this.dialogueController = new DialogueController(this, "AsebDefeat", introAsebData);
        this.dialogueController.iniDialogue();
        
        this.events.on('nextDialog',()=>
        {
            this.dialogueController.handleInteraction();
        });

        this.events.on('Finished', () => {

            if (this.playerData.TimeboxedMode) this.scene.start('TimeBoxedDefeat', this.playerData);
            else this.scene.start('AsebBeginScene', this.playerData)
            
            console.log("cambia de escena");
        });
    
    }
    openOptionMenu()
    {
        if (this.scene.isActive('OptionMenu')) return;
            this.scene.pause();
            this.playerData.SceneToResume = this.scene.key;
            this.scene.launch('OptionMenu', this.playerData);
    }
            
}
