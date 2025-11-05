import Tali from "../tali/tali.js";

export class LoadingScene extends Phaser.Scene 
{
    constructor() 
    {
        super('LoadingScene');
    }

    preload() 
    {   
        this.with = this.sys.game.canvas.width;
        this.height = this.sys.game.canvas.height;

        let progressBoxWidth = 620;
        let progressBoxHeight = 80;

        let progressBoxPosX = this.with / 2 - progressBoxWidth / 2;
        let progressBoxPosY = this.height / 2 - progressBoxHeight / 2;


        let progressBarWidth = progressBoxWidth - 20;
        let progressBarHeight = progressBoxHeight - 20


        let progressBox = this.add.graphics();
        let progressBar = this.add.graphics();
        progressBox.fillStyle(0xff0000, 1);
        progressBox.fillRect(progressBoxPosX, progressBoxPosY, progressBoxWidth, progressBoxHeight);

        let percentageText = this.add.text(progressBoxPosX + progressBoxWidth/2, progressBoxPosY + progressBoxHeight/2, "0%", {fontSize:40, color: '#000000ff', fontStyle: 'bold'}).setOrigin(0.5)
        let loadingText = this.add.text(progressBoxPosX + progressBoxWidth/2, progressBoxPosY - 40, "Loading...", {fontSize:55}).setOrigin(0.5);
        let loadingInfo = this.add.text(progressBoxPosX + progressBoxWidth/2, progressBoxPosY + progressBoxHeight + 40 , "Starting game...", {fontSize:35}).setOrigin(0.5);

        this.loadIntroAssets();
        this.loadAsebAssets();
        this.loadTaliAssets();
        this.loadTestAssets();
        




    this.load.on('progress', (value) => {
    console.log(value);
    progressBar.clear();
    progressBar.fillStyle(0xFFFFFF, 1);
    progressBar.fillRect(progressBoxPosX + 10, progressBoxPosY + 10, progressBarWidth * value, progressBarHeight);
    // the progress bar has to be 10 pixels to the right and down to be centered in side the progressBox

    percentageText.setText(Math.trunc(value * 100) + "%");
    });
            
    this.load.on('fileprogress', (file) => {
        console.log(file.src);
        loadingInfo.setText("Loading: " + file.key +"\nFrom: " + file.src);
    });
    this.load.on('complete', () => {
        console.log('complete');

        progressBar.destroy();
        progressBox.destroy();
        
        this.scene.start("Intro");  
    });
    }

    /**
     * Loads all intro assets.
     */
    loadIntroAssets() {
        this.load.image('IntroBackgroundPlaceholder', 'Phaser/assets/Intro/IntroBackgroundPlaceholder.jpeg');
    }

    /**
     * Loads all aseb assets.
     */
    loadAsebAssets() {
        this.load.image('StickBoard', 'Phaser/assets/aseb/stickBoard.png');
        this.load.image('StickLight', 'Phaser/assets/aseb/AsebStickLight.png');
        this.load.image('StickDark', 'Phaser/assets/aseb/AsebStickDark.png');

        this.load.image('asebBoard', 'Phaser/assets/aseb/AsebBoard.png');
        this.load.image('redPiece', 'Phaser/assets/aseb/redPiece.png');
        this.load.image('bluePiece', 'Phaser/assets/aseb/bluePiece.png');
    }

    /**
     * Loads all tali assets.
     */
    loadTaliAssets() {
        this.load.image('taliBoard', 'Phaser/assets/tali/temporary_board.png');
        for (let i = 0; i < Tali.NUMBER_OF_DICE; i++) { // de momento pongo 4 por que number of dice es 4 pero
            //seria mas profesinal traer el valor de number of dice sin tener que importar todo el tali 
            this.load.image('dice' + i, 'Phaser/assets/tali/temporary_dice' + i + '.png');
        }
        for (let i = 0; i < Tali.DICE_THROW_NAMES; i++) {
            this.load.image(Tali.DICE_THROW_NAMES[0], 'Phaser/assets/tali/temporary_throw' + i);
        }
    }

    /**
     * Loads test assets.
     * Only exists to make loading slower, otherwise we wouldn't be able to see the loading screen.
     */
    loadTestAssets() {
        for (let i = 0; i < 500; i++) {
            this.load.image('loadingTest' + i, 'Phaser/assets/tali/temporary_board.png')
        }
    }
}