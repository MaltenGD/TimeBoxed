import Score from "./score.js";

export const TALI_THROWS = {
    VENUS: {name: 'VENUS', value: 5},
    MARTE: {name: 'MARTE', value: 3},
    JUPITER: {name: 'JUPITER', value: 1},
    NEPTUNO: {name: 'NEPTUNO', value: 0},
    LUNA: {name: 'LUNA', value: 0}
}

/**
 * @class TaliPlayer
 * Abstract class for any player of tali.
 */
export default class TaliPlayer {
    score;
    throws = [];

    constructor() {
        this.score = new Score();
    }

    get score() {
        return this.score;
    }

    resetScore() {
        this.score = 0;
    }

    addThrow(roll) {
        roll.forEach(element => {
            this.throws.push(element);
            this.score.addScore(element.value);
        });
    }
}