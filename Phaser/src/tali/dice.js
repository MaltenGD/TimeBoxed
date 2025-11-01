export default class Dice extends Phaser.GameObjects.Image {
    constructor(scene, x, y, image) {
        super(scene, x, y, image);
        this.scene = scene;
        this.image = image;
        this.setOrigin(0, 0.5);
        this.setScale(0.3);
        this.setAlpha(1);
        this.scene.add.existing(this);
        
    }

    setDicePosition(offsetX, offsetY = 0) {
        this.setPosition(this.x + offsetX, this.y + offsetY);
    }

    setDiceAlpha(level) {
        this.setAlpha(level);
    }

    setDiceScale(scale) {
        this.setScale(scale);
    }
}