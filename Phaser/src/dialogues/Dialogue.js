import Speaker from './Speaker.js';

/**
 * @class Dialogue
 * A data class to represent a single line of dialogue, including the speaker and the text.
 */
export default class Dialogue{
    /**
     * @param {Speaker} speaker The speaker of this line of dialogue.
     * @param {string} text The text  of the dialogue.
     * @param {boolean} animated If the text has animation or not.
     */
    constructor(speaker, text, isAnimated) {
        this.speaker = speaker;
        this.text = text;
        this.animated = isAnimated || false; // parametro default por si se nos olvida
    }
}
