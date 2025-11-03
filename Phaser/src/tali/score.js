/**
 * Class for computing and storing a player's score.
 */
export default class Score {
    score = 0;

    addScore(score) {
        this.score += score;
    }

    get score() {
        return this.score;
    }
}