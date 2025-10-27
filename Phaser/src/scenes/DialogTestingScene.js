import DialogueController from '../DialogueController.js';

export class DialogTestingScene extends Phaser.Scene {
    constructor() {
        super('DialogTestingScene');
    }

    preload() {
        // Aqui agregaremos los assets para los dialogos, las font, etc...
    }

    create() {
        this.cameras.main.setBackgroundColor('#1d6290ff');

        this.dialogueController = new DialogueController();

        this.dialogueController.init(this); // Este metodo carga todos los dialogos del juego

        // En futuro sería conveniente que cargaramos la instancia de esta clase
        // (DialogueController) y el metodo init desde una escena para carga de assets

        this.dialogueController.start(this,"Intro"); // Establece la escena donde se va a mostrar el dialogo
        // y el bloque de dialogo en cuestión


        this.input.on('pointerdown', () => {
            this.dialogueController.handleInteraction();
        });
    }
}