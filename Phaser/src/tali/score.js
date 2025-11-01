export const TALI_THROWS = {
    VENUS: 5,
    MARTE: 3,
    JUPITER: 1,
    NEPTUNO: 0,
    LUNA: 'LUNA'
}

export default class Score {
    throws = [];
    score = 0;

    addThrow(roll) {
        this.throws.push(roll);
        this.score += roll;
    }
}