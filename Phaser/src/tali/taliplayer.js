export const TALI_THROWS = {
    VENUS: {name: 'VENUS', value: 5},
    MARTE: {name: 'MARTE', value: 3},
    JUPITER: {name: 'JUPITER', value: 1},
    NEPTUNO: {name: 'NEPTUNO', value: 0},
    LUNA: 'LUNA'
}

/**
 * @class TaliPlayer
 * Abstract class for any player of tali.
 */
export default class TaliPlayer {
    score;
    throws = [];

    constructor() {
        this.score = 0;
    }

    get score() {
        return this.score;
    }

    resetScore() {
        this.score = 0;
    }

    addThrow(roll) {
        this.throws.push(roll);
        this.score.addScore(roll.value);
    }
}