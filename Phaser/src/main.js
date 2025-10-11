import { Start } from './scenes/Start.js';
import { SelectionMenuScene } from './scenes/SelectionMenuScene.js';
import { GameScene } from './scenes/GameScene.js';

const config = {
    type: Phaser.CANVAS,
    title: 'Overlord Rising',
    description: '',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    pixelArt: false,
    scene: [
        Start,
        GameScene,
        SelectionMenuScene

    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);


