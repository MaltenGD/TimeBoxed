import Achievement from "./achivement.js";

export default class AchievementManager {
    constructor() {
        /** @property The total number of achievements. */
        this.achievementNr = 0;

        /** @property The map of achievements. Key: ID, value: the object */
        this.achievementMap = new Map();
    }

    /**
     * Loads the achievements from a json file.
     * @param {string} jsonFile The json file to load achievements from.
     */
    loadAchievements(jsonFile) {
        let temp, img;
        for (let key in jsonFile.Achievements) {
            temp = new Achievement(key, key.name, key.description, key.image)
            this.achievementMap.set(key, temp);
            console.log("ACHIEVEMENT " + key + " " + key.name);
        }
    }

    /**
     * Retrieve an achievement from the map by its key.
     * @param {string} key The key which identifies the achievement object.
     * @returns The achievement matching the given key.
     */
    getAchievementByKey(key) {
        return map.get(key);
    }

    /**
     * Awards the given achievement.
     * @param {string} key The key which identifies the achievement object.
     */
    awardAchievement(key) {
        map.get(key).awardAchievement();
    }
}