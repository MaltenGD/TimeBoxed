/**
 * @class RandomNumber
 * A class to generate a random number.
 */
export default class RandomNumber {
    /**
     * @argument min: the lower limit (inclusive)
     * @argument max: the upper limit (exclusive)
     * @returns a random number between min and max.
     */
    static get(min, max) {
        return Phaser.Math.Between(min, max - 1);
    }
}