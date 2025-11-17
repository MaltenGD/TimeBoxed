import DialogueController from "../../DialogueController.js";

export class AsebVictoryScene extends Phaser.Scene
{
    constructor(){super('AsebVictoryScene');}

    preload()
    {

        /** Load the json file for the Intro Dialogue 
        * @param {string} key - The key to reference the loaded JSON data.
        * @param {string} url - The URL of the JSON file to load.
        */
        this.load.json('AsebWinDialogue', 'Phaser/DialoguesJson/AsebWinDialogue.json');
    }

    create(playerData) 
    {

        this.playerData = playerData;
        console.log(this.playerData)

        // Get the canvas width and height to use when giving a position to an object
        let { width, height } = this.sys.game.canvas;

        this.awardAch();

        this.input.keyboard.on('keydown-ESC', () => {
           this.openOptionMenu();
        });

        //creating the background
        this.background = this.add.image(width / 2, height / 2, 'asebBackgroundPlaceholder').setDisplaySize(width, height);

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

        /** variable json*/
        const introAsebData = this.cache.json.get('AsebWinDialogue');
        this.dialogueController = new DialogueController(this, "AsebWin", introAsebData);
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

    awardAch() {
        this.achManager = this.registry.get('AchievementManager');
        this.achManager.awardAchievement('TA1');
        console.log("AS1 awarded!");
        this.registry.set('AchievementManager', this.achManager);
    }
    
    openOptionMenu()
    {
        if (this.scene.isActive('OptionMenu')) return;
            this.scene.pause();
            this.playerData.SceneToResume = this.scene.key;
            this.scene.launch('OptionMenu', this.playerData);
    }
            
}
