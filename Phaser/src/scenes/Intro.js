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
    }
    
    create() 
    {
        // Get the canvas width and height to use when giving a position to an object
        let { width, height } = this.sys.game.canvas;

        //creating the background
        this.background = this.add.image(width / 2, height / 2, 'IntroBackgroundPlaceholder').setDisplaySize(width, height);

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
       
        this.dialogueController = new DialogueController(this, "Intro");
        this.dialogueController.create();
        
        this.events.on('nextDialog',()=>
        {
            this.dialogueController.handleInteraction();
        });

        this.events.on('IntroFinished', () => {
            this.scene.start('SelectionMenuScene');
            console.log("cambia de escena");
        });

    }
        
}