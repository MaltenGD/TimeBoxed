export class HanafudaGame extends Phaser.Scene{
    constructor()
    {
        super('HanafudaGame')

        this.playerFirst = null;
    }

    init(data)
    {
        this.playerFirst = data.begins;
    }

    preload()
    {
        /** @type {number} */
        let {width, height} = this.sys.game.canvas;
        this.width = width;
        this.height = height;
    }

    create(playerData)
    {
         this.playerData = playerData;
        console.log(this.playerData)

        this.input.keyboard.on('keydown-ESC', () => {
            this.openOptionMenu();
        });

        this.background = this.add.image(this.width/2, this.height/2, 'HanafudaBackgroundPlaceholder');

        this.backBtn = this.add.text(0, 0, 'Back', { fontSize: 64, fill: '#000000ff'})
        .setInteractive()
        .on('pointerover', () => this.backBtn.setStyle({fill: 'rgba(104, 35, 35, 1)'}))
        .on('pointerout', () => this.backBtn.setStyle({fill: '#000000ff'}))
        .on('pointerdown', () => {
            this.openOptionMenu();
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