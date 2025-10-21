/**
 * @class Dice
 * The dice for the Tali game.
 */
export default class Dice {
    diceRolls = [1, 3, 4, 6];
    /**
     * Roll the dice.
     * @returns a random number between 1, 3, 4, and 6
     */
    rollDice() {
        return diceRolls[Phaser.Math.Between(0, 4)];
    }

    rollDiceIndex() {
        return Phaser.Math.Between(0,4);
    }
}