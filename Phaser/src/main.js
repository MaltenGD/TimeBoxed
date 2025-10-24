import { Start } from './scenes/Start.js';
import { SelectionMenuScene } from './scenes/SelectionMenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { TaliScene } from './scenes/taliScenes/TaliScene.js';
import { TaliBeginScene } from './scenes/taliScenes/TaliBeginScene.js';
import { AsebScene } from './scenes/AsebScene.js';
import { HanafudaScene } from './scenes/HanafudaScene.js';
import { CreditsScene } from './scenes/CreditsScene.js';

const config = {
    type: Phaser.CANVAS,
    title: 'Timeboxed',
    description: '',
    parent: 'game-container',
    width: 2560,
    height: 1440,
    backgroundColor: '#000000',
    pixelArt: false,
    scene: [
        Start,
        CreditsScene,
        SelectionMenuScene,
        GameScene,
        AsebScene,
        TaliScene,
        TaliBeginScene,
        HanafudaScene
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);


