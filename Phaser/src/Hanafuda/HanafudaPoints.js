import { getCardFlags } from './HanafudaCardType.js';
import { calculateYakus } from './HanafudaScore.js';
import { HANAFUDA_STATE } from '../scenes/HanafudaScenes/HanafudaGameState.js';
export default class HanafudaPoints {

    constructor(scene) {
        this.scene = scene;
        this.popup = null;
    }

    close() {
        if (!this.popup) return;
        Object.values(this.popup).forEach(p => p?.destroy?.());
        this.popup = null;
    }

    showPlayer(yaku, points) {
        this.close();

        const overlay = this.scene.add.rectangle(this.scene.width/2, this.scene.height/2, this.scene.width, this.scene.height, 0x000000, 0.6)
        .setDepth(9000).setInteractive();

        const box = this.scene.add.rectangle(this.scene.width/2, this.scene.height/2, 900, 500, 0x002016)
        .setStrokeStyle(6, 0xaa0000).setDepth(10000);

        const title = this.scene.add.text(this.scene.width/2, this.scene.height/2 - 140, "You've got a Yaku", {
            fontSize: "48px", color: "#ffffffff"
        }).setOrigin(0.5).setDepth(10001);

        const yText = this.scene.add.text(this.scene.width/2, this.scene.height/2 - 40, "Combination: " + yaku, {
            fontSize: "36px", color: "#ffffffff"
        }).setOrigin(0.5).setDepth(10001);

        const pText = this.scene.add.text(this.scene.width/2,this.scene.height/2 + 40, "Points: " + points, {
            fontSize: "30px", color: "#d6d6d6ff"
        }).setOrigin(0.5).setDepth(10001);

        const koi = this.scene.add.text(this.scene.width/2 - 150, this.scene.height/2 + 140, "Koikoi", {
            fontSize: "36px", backgroundColor: "#0066cc", padding: 8, color:"#fff"
        }).setOrigin(0.5).setDepth(10002);

        const shobu = this.scene.add.text(this.scene.width/2 + 150, this.scene.height/2 + 140, "Shobu", {
            fontSize: "36px", backgroundColor: "#a40021ff", padding: 8, color:"#fff"
        }).setOrigin(0.5).setDepth(10002);
        
        this.popup = { overlay, box, title, yText, pText, koi, shobu };

        koi.setInteractive()
        .on("pointerover", ()=> {backgroundColor: "#02468bff"})
        .on("pointerout", ()=> {backgroundColor: "#0066cc"})
        .on("pointerdown", () => {
            console.log("player Elige KoiKoi");
            this.close();
            this.scene.currentState = null;
            this.scene.koikoiAccumulatedPlayer = points;
            this.onKoikoi(); 
        });

        shobu.setInteractive()
        .on("pointerover", ()=> {backgroundColor: "#780219ff"})
        .on("pointerout", ()=> {backgroundColor: "#a40021ff"})
        .on("pointerdown", () => {
            console.log("player Elige Shobu");
            this.close();
            this.scene.currentState = null;
            this.onShobu(points);
        });
    }

    onShobu(totalPoints) {
        //this.scene.shobuWinner = this.scene.playerTurn ? "player" : "opponent";
        this.scene.lastRoundWinner = "player";
        this.scene.lastRoundPoints =totalPoints;
        this.scene.koikoiActivePlayer = false;
        this.scene.koikoiAccumulatedPlayer = 0;
        this.scene.transitionTo(HANAFUDA_STATE.FINISH_ROUND);
    }

    onKoikoi() {
        console.log("Player Koikoi, puntos acumulados:", this.scene.koikoiAccumulatedPlayer);
        this.scene.koikoiActivePlayer = true;

        if(this.scene.previousState === HANAFUDA_STATE.SEARCH_ACTION)
        this.scene.transitionTo(HANAFUDA_STATE.REFILL_ACTION);

        if(this.scene.previousState === HANAFUDA_STATE.REFILL_ACTION)
        this.scene.transitionTo(HANAFUDA_STATE.CHECK_END_ROUND);
    }

    showEnemy(yaku, points) {
        this.close();

        const overlay = this.scene.add.rectangle(this.scene.width/2, this.scene.height/2, this.scene.width, this.scene.height, 0x000000, 0.6)
        .setDepth(9000).setInteractive();

        const box = this.scene.add.rectangle(this.scene.width/2, this.scene.height/2, 900, 420, 0x002016)
        .setStrokeStyle(6, 0xaa0000).setDepth(10000);

        const title = this.scene.add.text(this.scene.width/2, this.scene.height/2 - 120,
        "Benten got a Yaku!", { fontSize:"48px", color:"#fffdfdff" }).setOrigin(0.5).setDepth(10001);

        const yText = this.scene.add.text(this.scene.width/2, this.scene.height/2 - 30,
        "Combination: " + yaku,{ fontSize:"36px", color:"#ffffffff" }).setOrigin(0.5).setDepth(10001);

        const pText = this.scene.add.text(this.scene.width/2, this.scene.height/2 + 40,
        "Point: " + points, { fontSize:"28px", color:"#dcdcdcff" } ).setOrigin(0.5).setDepth(10001);

        this.popup = { overlay, box, title, yText, pText };

        this.scene.time.delayedCall(1500, () => { this.close();});
    }

    onEnemyShobu(yaku,points) {

        console.log("Enemy shobu with", points);

        this.scene.lastRoundWinner = "opponent";
        this.scene.lastRoundPoints = points;
        this.showEnemy(yaku,points);
        this.scene.koikoiActiveEnemy = false;
        this.scene.koikoiAccumulatedEnemy = points;
        this.scene.transitionTo(HANAFUDA_STATE.FINISH_ROUND);

        }
    onKoikoiEnemy(yaku,points) {
            this.scene.koikoiActiveEnemy = true;
            this.showEnemy(yaku, points);
            if(this.scene.previousState === HANAFUDA_STATE.SEARCH_ACTION)
            this.scene.transitionTo(HANAFUDA_STATE.REFILL_ACTION);

            if(this.scene.previousState === HANAFUDA_STATE.REFILL_ACTION)
            this.scene.transitionTo(HANAFUDA_STATE.CHECK_END_ROUND);
        }


    checkYakus() {
        const cards = this.scene.playerTurn ? this.scene.playerPairs : this.scene.opponentPairs;
        const { yakus, points } = calculateYakus(cards);

        if (yakus.length === 0) return;

        const last = yakus[yakus.length - 1];

        // this.scene.lastRoundPoints = points;
        // this.scene.lastRoundWinner = this.scene.playerTurn ? "player" : "opponent";
        let active = this.scene.playerTurn ? this.scene.koikoiActivePlayer : this.scene.koikoiActiveEnemy;
        let accumulated = this.scene.playerTurn? this.scene.koikoiAccumulatedPlayer : this.scene.koikoiAccumulatedEnemy;

        if (active) 
        {
        accumulated += points;
        } 
        else {
            accumulated = points;
        }

        if (this.scene.playerTurn) this.showPlayer(last, accumulated);
        else{
            const shobu = Math.random() < 0.5;
            console.log("enemy decision Yaku:", shobu ? "Shobu" : "Koikoi");
            this.showEnemy(last, accumulated);

            if (shobu) this.onEnemyShobu(last,accumulated);
            else this.onKoikoiEnemy(last, accumulated);
        }
    }

    hasCombinations(pairsArray) {
        const result = calculateYakus(pairsArray);

        if (!result || !Array.isArray(result.yakus)) return false;

        return result.yakus.length > 0;
    }


}
