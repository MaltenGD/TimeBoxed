/**
 * @class TaliPlayer
 * Abstract class for any player of tali.
 */
export default class TaliPlayer {
    score;

    constructor() {
        if (this.constructor == TaliPlayer) {
            throw new Error("TaliPlayer is abstract. Cannot instantiate abstract class.");
        }
        this.score = 0;
    }

    get score() {
        return this.score;
    }

    resetScore() {
        this.score = 0;
    }
}