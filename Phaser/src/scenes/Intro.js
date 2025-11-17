import DialogueController from "../DialogueController.js";

/**  
 *  @class Intro
 *  This class/scene shows the intro background and dialogues of the player meeting kronos
 */
export class Intro extends Phaser.Scene 
{
    constructor() 
    {
        super('Intro');
    }

    // Here we will load the assets for dialogues, fonts, etc...
    preload()
    {
        // loads the background
        this.load.image('IntroBackgroundPlaceholder', 'Phaser/assets/Intro/IntroBackgroundPlaceholder.jpeg');

        /** Load the json file for the Intro Dialogue 
        * @param {string} key - The key to reference the loaded JSON data.
        * @param {string} url - The URL of the JSON file to load.
        */
        this.load.json('IntroDialogue', 'Phaser/DialoguesJson/IntroDialogue.json');
    }
    
    create() 
    {
        // Get the canvas width and height to use when giving a position to an object
        let { width, height } = this.sys.game.canvas;

        this.input.keyboard.on('keydown-ESC', () => {
            if (this.scene.isActive('OptionMenu')) return;
            this.scene.pause();
            this.scene.launch('OptionMenu', { sceneToPause: this.scene.key });
        });

        //creating the background
        this.background = this.add.image(width / 2, height / 2, 'IntroBackgroundPlaceholder').setDisplaySize(width, height);

        this.backBtn = this.add.text(0, 0, 'Back', { fontSize: 64, fill: '#000000ff'})
        .setInteractive()
        .on('pointerover', () => this.backBtn.setStyle({fill: 'rgba(104, 35, 35, 1)'}))
        .on('pointerout', () => this.backBtn.setStyle({fill: '#000000ff'}))
        .on('pointerdown', () => {
            this.openOptionMenu();
        });
        
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

        //dialogues
        const introData = this.cache.json.get('IntroDialogue');
        this.dialogueController = new DialogueController(this, "Intro", introData);
        this.dialogueController.iniDialogue();
        
        this.events.on('nextDialog',()=>
        {
            this.dialogueController.handleInteraction();
        });

        this.events.on('Finished', () => {
            this.scene.start('SelectionMenuScene');
            console.log("cambia de escena");
        });

    }
    openOptionMenu()
    {
        if (this.scene.isActive('OptionMenu')) return;
            this.scene.pause();
            this.scene.launch('OptionMenu', { sceneToPause: this.scene.key });
    }
        
}