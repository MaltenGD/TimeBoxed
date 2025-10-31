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
        this.load.image('kronosPlaceholder', 'Phaser/assets/KronosPlaceHolder.png');
        
    }
    
    create() 
    {
        this.cameras.main.setBackgroundColor('#1f6696ff');

        this.dialogueController = new DialogueController();

        this.dialogueController.init(); // Este metodo carga todos los dialogos del juego

        // En futuro sería conveniente que cargaramos la instancia de esta clase
        // (DialogueController) y el metodo init desde una escena para carga de assets

        this.dialogueController.start(this,"Intro"); // Establece la escena donde se va a mostrar el dialogo
        // y el bloque de dialogo en cuestión


        this.input.on('pointerdown', () => {
            this.dialogueController.handleInteraction();
        });

        this.events.on('IntroFinished', () => {
            this.scene.start('SelectionMenuScene');
            console.log("cambia de escena");
        });

    }
        
}