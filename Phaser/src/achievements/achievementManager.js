import Achievement from "./achivement.js";

export default class AchievementManager {
    constructor() {
        /** @property The number of awarded achievements. */
        this.awardedAchievements = 0;

        /** @property The map of achievements. Key: ID, value: the object */
        this.achievementMap = new Map();
    }

    /**
     * @property The total number of achievements
     */
    get nrOfAchievements() {
        return this.achievementMap.size;
    }

    get nrOfAwardedAchievements() {
        return this.awardedAchievements;
    }

    /**
     * Loads the achievements from a json file.
     * @param {string} jsonFile The json file to load achievements from.
     */
    loadAchievements(jsonFile) {
        let temp;
        let achievementsObj = jsonFile.Achievements;
        for (let key in achievementsObj) {
            temp = new Achievement(key, achievementsObj[key]['name'], achievementsObj[key]['description'], achievementsObj[key]['image'])
            this.achievementMap.set(key, temp);
            console.log("LOADED ACHIEVEMENT " + key + " " + achievementsObj[key]['name']);
        }
    }

    /**
     * Retrieve an achievement from the map by its key.
     * @param {string} key The key which identifies the achievement object.
     * @returns The achievement matching the given key.
     */
    getAchievementByKey(key) {
        return this.achievementMap.get(key);
    }

    /**
     * Awards the given achievement.
     * @param {string} key The key which identifies the achievement object.
     */
    awardAchievement(key) {
        this.achievementMap.get(key).awardAchievement();
        this.awardedAchievements++
    }

    /**
     * Revokes the given achievement.
     * @param {string} key The key which identifies the achievement object.
     */
    revokeAchievement(key) {
        this.achievementMap.get(key).revokeAchievement();
    }

    /**
     * Checks if the player has completed all the games and awards the G1 achievement.
     */
    checkGameCompletion(playerData) {
        if (this.achievementMap.get('TA1').awarded && this.achievementMap.get('AS1').awarded && this.achievementMap.get('HA1').awarded) {
            this.awardAchievement('G1');
            if (playerData.TimeboxedMode) {
                this.awardAchievement('G2');
            }
        }
    }
}