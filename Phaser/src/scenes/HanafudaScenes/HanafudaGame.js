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



}