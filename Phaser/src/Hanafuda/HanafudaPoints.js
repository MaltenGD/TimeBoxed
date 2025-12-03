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

        const title = this.scene.add.text(this.scene.width/2, this.scene.height/2 - 140, "Has conseguido un Yaku", {
            fontSize: "48px", color: "#ffffffff"
        }).setOrigin(0.5).setDepth(10001);

        const yText = this.scene.add.text(this.scene.width/2, this.scene.height/2 - 40, "Combinacion: " + yaku, {
            fontSize: "36px", color: "#ffffffff"
        }).setOrigin(0.5).setDepth(10001);

        const pText = this.scene.add.text(this.scene.width/2,this.scene.height/2 + 40, "Puntos: " + points, {
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
            this.onKoiKoi(); 
        });

        shobu.setInteractive()
        .on("pointerover", ()=> {backgroundColor: "#780219ff"})
        .on("pointerout", ()=> {backgroundColor: "#a40021ff"})
        .on("pointerdown", () => {
            console.log("player Elige Shobu");
            this.close();
            this.scene.currentState = null;
            this.onShobu();
        });
    }

    onShobu() {
        //this.scene.shobuWinner = this.scene.playerTurn ? "player" : "opponent";
        this.scene.lastRoundWinner = "player";
        this.scene.lastRoundPoints = points;
        this.scene.transitionTo(HANAFUDA_STATE.FINISH_ROUND);
    }

    onKoikoi() {
        if(this.scene.previousState === HANAFUDA_STATE.SEARCH_ACTION)
        this.scene.transitionTo(HANAFUDA_STATE.REFILL_ACTION);

        if(this.scene.previousState === HANAFUDA_STATE.REFILL_ACTION)
        this.scene.transitionTo(HANAFUDA_STATE.CHECK_END_ROUND);
    }

    showEnemy(yaku, points) {
        this.close();

        const overlay = this.scene.add.rectangle(this.scene.width/2, this.scene.height/2, this.scene.width, this.scene.height, 0x000000, 0.6)
        .setDepth(9000).setInteractive();

        const box = this.scene.add.rectangle(this.scene.width/2, this.scene.height/2, 900, 420, 0xffffff)
        .setStrokeStyle(6, 0xaa0000).setDepth(10000);

        const title = this.scene.add.text(this.scene.width/2, this.scene.height/2 - 120,
        "El oponente consiguio un Yaku", { fontSize:"40px", color:"#000" }).setOrigin(0.5).setDepth(10001);

        const yText = this.scene.add.text(this.scene.width/2, this.scene.height/2 - 30,
        "Combinacion: " + yaku,{ fontSize:"32px", color:"#000" }).setOrigin(0.5).setDepth(10001);

        const pText = this.scene.add.text(this.scene.width/2, this.scene.height/2 + 40,
        "Puntos: " + points, { fontSize:"28px", color:"#333" } ).setOrigin(0.5).setDepth(10001);

        this.popup = { overlay, box, title, yText, pText };

        this.scene.time.delayedCall(1500, () => { this.close();});
    }

    checkYakus() {
        const cards = this.scene.playerTurn ? this.scene.playerPairs : this.scene.opponentPairs;
        const { yakus, points } = calculateYakus(cards);

        if (yakus.length === 0) return;

        const last = yakus[yakus.length - 1];

        this.scene.lastRoundPoints = points;
        this.scene.lastRoundWinner = this.scene.playerTurn ? "player" : "opponent";

        if (this.scene.playerTurn) this.showPlayer(last, points);
        else{
            const shobu = Math.random() < 0.5;
            console.log("enemy decision Yaku:", shobu ? "Shobu" : "Koikoi");
            this.showEnemy(last, points);
            if (shobu) this.onShobu();
            else this.onKoikoi();
        }
    }

    hasCombinations(pairsArray) {
        const result = calculateYakus(pairsArray);

        if (!result || !Array.isArray(result.yakus)) return false;

        return result.yakus.length > 0;
    }


}
