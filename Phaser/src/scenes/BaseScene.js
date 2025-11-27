/**
 * @class BaseScene
 * A base scene that provides common functionality for other scenes,
 * such as sound management and transitions.
 */
export class BaseScene extends Phaser.Scene {
    constructor(key) {
        super({ key: key });
        this.soundInstances = [];
        this.OptionMenuCanBeOpened = true;
    }

    init() {
        // Listen for the scene's shutdown event.
        // When it occurs, call the shutdown method.
        // This is done in `init` because scene systems (like `events`)
        // are not available in the constructor.
        this.events.on('shutdown', this.shutdown, this);
        this.input.keyboard.on('keydown-ESC', this.openOptionMenu, this);

        // Listen for scene pause and resume events to manage sounds.
        this.events.on('pause', this.pauseSounds, this);
        this.events.on('resume', this.resumeSounds, this);
    }

    DisableOptionMenu() {
        this.OptionMenuCanBeOpened = false;
        this.input.keyboard.off('keydown-ESC', this.openOptionMenu, this);
    }

    EnableOptionMenu() {
        
        this.OptionMenuCanBeOpened = true;
        this.input.keyboard.on('keydown-ESC', this.openOptionMenu, this);
    }

    /**
     * Stops all sounds managed by this scene.
     * This is typically called before transitioning to a new scene.
     */
    KillSounds() {
        for (const sound of this.soundInstances) {
            if (sound && sound.isPlaying) {
                sound.stop();
            }
        }
    }


    fadeOutAndKillSounds(duration = 400) {
        // Filter for sounds that are currently playing.
        const soundsToFade = this.soundInstances.filter(sound => sound && sound.isPlaying);

        // If there are sounds to fade, create a tween for them.
        if (soundsToFade.length > 0) {
            this.tweens.add({
                targets: soundsToFade,
                volume: 0,
                duration: duration,
                ease: 'Linear',
                onComplete: () => this.KillSounds()
            });
        }
    }

    /**
     * Pauses all managed sounds that are currently playing.
     * This is called automatically when the scene is paused.
     */
    pauseSounds() {
        for (const sound of this.soundInstances) {
            if (sound && sound.isPlaying) {
                sound.pause();
            }
        }
    }

    /**
     * Resumes all managed sounds that were previously paused.
     * This is called automatically when the scene is resumed.
     */
    resumeSounds() {
        for (const sound of this.soundInstances) {
            if (sound && sound.isPaused) {
                sound.resume();
            }
        }
    }

    /**
     * This method is called by the Scene Manager when the scene shuts down.
     * It ensures sounds are stopped and cleans up the event listener.
     */
    shutdown() {
        this.KillSounds();
        this.events.removeListener('shutdown', this.shutdown, this);
        this.events.removeListener('pause', this.pauseSounds, this);
        this.events.removeListener('resume', this.resumeSounds, this);
    }

    /**
     * Pauses the current scene and launches the Option Menu.
     * It passes the current scene's key so the Option Menu knows where to return.
     */
    openOptionMenu()
    {
        if (this.scene.isActive('OptionMenu') || !this.OptionMenuCanBeOpened) return;
        this.scene.pause();
        this.playerData.SceneToResume = this.scene.key;
        this.scene.launch('OptionMenu', this.playerData);
    }
}