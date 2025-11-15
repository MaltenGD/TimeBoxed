export default class Achievement {
    constructor(key, name, description, img) {
        this.id = key;
        this.name = name;
        this.description = description;
        this.image = img;
        this.awarded = false;
    }

    awardAchievement() {
        this.awarded = true;
    }

    get awarded() {
        return this.awarded;
    }
}