import { Start } from './scenes/Start.js';
import { SelectionMenuScene } from './scenes/SelectionMenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { TaliScene } from './scenes/TaliScene.js';
import { AsebScene } from './scenes/AsebScene.js';
import { HanafudaScene } from './scenes/HanafudaScene.js';

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
        SelectionMenuScene,
        GameScene,
        AsebScene,
        TaliScene,
        HanafudaScene
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);


