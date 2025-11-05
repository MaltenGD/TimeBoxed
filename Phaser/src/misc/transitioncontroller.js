export class RGBColor {
    constructor(red, green, blue, alpha = 1) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
}

export default class TransitionController {
    constructor(scene) {
        this.scene = scene;
        this.camera = this.scene.cameras.main;
        this.emitter = new Phaser.Events.EventEmitter();
    }

    /**
     * Fades out the camera
     * @param {number} time - time it takes for the transition to occur. Default: 1000 ms
     * @param {RGBColor} color - color to fade to.
     */
    startFadeOutTransition(time = 1000, color = new RGBColor(0, 0, 0)) {
        this.camera.fadeOut(time, color.red, color.green, color.blue, (camera, progress) => {
            if (progress === 1) {
                this.emitter.emit('fadeOutComplete');
            }
        });
    }

    /**
     * Fades in the camera.
     * @param {number} time - time it takes for the transition to occur. Default: 1000 ms
     * @param {RGBColor} color - color to fade in from. Default: (0, 0, 0) - black 
     */
    startFadeInTransition(time = 1000, color = new RGBColor(0, 0, 0)) {
        this.camera.fadeIn(time, color.red, color.green, color.blue, (camera, progress) => {
            if (progress === 1) {
                this.emitter.emit('fadeInComplete');
            }
        });
    }

    startFlash() {

    }

    startPan() {

    }

    startRotate() {

    }

    startShake() {

    }

    startZoom() {
        
    }
}