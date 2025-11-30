import { getCardFlags } from '../scenes/HanafudaScenes/HanafudaCardType.js';
import { calculateYakus } from '../scenes/HanafudaScenes/HanafudaScore.js';
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

    showPlayer(yaku, points, onKoiKoi, onShobu) {
        this.close();

        const overlay = this.scene.add.rectangle(this.scene.width/2, this.scene.height/2, this.scene.width, this.scene.height, 0x000000, 0.6)
            .setDepth(9000).setInteractive();

        const box = this.scene.add.rectangle(this.scene.width/2, this.scene.height/2, 900, 500, 0xffffff)
            .setStrokeStyle(6, 0xaa0000).setDepth(10000);

        const title = this.scene.add.text(this.scene.width/2, this.scene.height/2 - 140, "Has conseguido un Yaku", {
            fontSize: "48px", color: "#000"
        }).setOrigin(0.5).setDepth(10001);

        const yText = this.scene.add.text(this.scene.width/2, this.scene.height/2 - 40, "Combinacion: " + yaku, {
            fontSize: "36px", color: "#000"
        }).setOrigin(0.5).setDepth(10001);

        const pText = this.scene.add.text(this.scene.width/2,this.scene.height/2 + 40, "Puntos: " + points, {
            fontSize: "30px", color: "#444"
        }).setOrigin(0.5).setDepth(10001);

        const koi = this.scene.add.text(this.scene.width/2 - 150, this.scene.height/2 + 140, "Koikoi", {
            fontSize: "36px", backgroundColor: "#0066cc", padding: 8, color:"#fff"
        }).setOrigin(0.5).setInteractive().setDepth(10002);

        const shobu = this.scene.add.text(this.scene.width/2 + 150, this.scene.height/2 + 140, "Shobu", {
            fontSize: "36px", backgroundColor: "#aa0022", padding: 8, color:"#fff"
        }).setOrigin(0.5).setInteractive().setDepth(10002);

        koi.on("pointerdown", () => { this.close(); onKoiKoi(); });
        shobu.on("pointerdown", () => { this.close(); onShobu(points); });

        this.popup = { overlay, box, title, yText, pText, koi, shobu };
    }

    showEnemy(yaku, points, onContinue) {
        this.close();

        const overlay = this.scene.add.rectangle(this.scene.width/2, this.scene.height/2, this.scene.width, this.scene.height, 0x000000, 0.6)
            .setDepth(9000).setInteractive();

        const box = this.scene.add.rectangle(this.scene.width/2, this.scene.height/2, 900, 420, 0xffffff)
            .setStrokeStyle(6, 0xaa0000).setDepth(10000);

        const title = this.scene.add.text(this.scene.width/2, this.scene.height/2 - 120,
            "El oponente consiguio un Yaku",
            { fontSize:"40px", color:"#000" }
        ).setOrigin(0.5).setDepth(10001);

        const yText = this.scene.add.text(this.scene.width/2, this.scene.height/2 - 30,
            "Combinacion: " + yaku,
            { fontSize:"32px", color:"#000" }
        ).setOrigin(0.5).setDepth(10001);

        const pText = this.scene.add.text(this.scene.width/2, this.scene.height/2 + 40,
            "Puntos: " + points,
            { fontSize:"28px", color:"#333" }
        ).setOrigin(0.5).setDepth(10001);

        this.popup = { overlay, box, title, yText, pText };

        this.scene.time.delayedCall(1200, () => { this.close(); onContinue(); });
    }
     checkYakus(isPlayer) {
    const cards = isPlayer ? this.scene.playerPairs : this.scene.opponentPairs;
    const { yakus, points } = calculateYakus(cards);

    if (yakus.length === 0) return;

    const last = yakus[yakus.length - 1];

    if (isPlayer) {
        this.showPlayer(last,points,() => {
                this.scene.gamePaused = false;
                this.scene.handlesTurns();
            },() => {
                this.scene.gamePaused = true;
                this.scene.transitionTo(HANAFUDA_STATE.FINISH_ROUND);
            }
        );
    } else {
        const shobu = Math.random() < 0.5;

        if (shobu) {
            this.showEnemy(last,points,() => this.scene.transitionTo(HANAFUDA_STATE.FINISH_ROUND));
        } else {this.showEnemy(last,points,() => { this.scene.gamePaused = false; this.scene.handlesTurns(); });
        }
    }
}
}
