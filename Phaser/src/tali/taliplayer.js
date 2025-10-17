/**
 * @class TaliPlayer
 * Abstract class for any player of tali.
 */
export default class TaliPlayer {
    constructor() {
        if (this.constructor == TaliPlayer) {
            throw new Error("TaliPlayer is abstract. Cannot instantiate abstract class.");
        }
    }
}