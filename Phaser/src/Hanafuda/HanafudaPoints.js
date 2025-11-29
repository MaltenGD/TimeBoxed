import { getCardFlags } from '../HanafudaScenes/HanafudaCardType.js';
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
        const s = this.scene;

        const overlay = s.add.rectangle(s.width/2, s.height/2, s.width, s.height, 0x000000, 0.6)
            .setDepth(9000).setInteractive();

        const box = s.add.rectangle(s.width/2, s.height/2, 900, 500, 0xffffff)
            .setStrokeStyle(6, 0xaa0000).setDepth(10000);

        const title = s.add.text(s.width/2, s.height/2 - 140, "Has conseguido un Yaku", {
            fontSize: "48px", color: "#000"
        }).setOrigin(0.5).setDepth(10001);

        const yText = s.add.text(s.width/2, s.height/2 - 40, "Combinacion: " + yaku, {
            fontSize: "36px", color: "#000"
        }).setOrigin(0.5).setDepth(10001);

        const pText = s.add.text(s.width/2, s.height/2 + 40, "Puntos: " + points, {
            fontSize: "30px", color: "#444"
        }).setOrigin(0.5).setDepth(10001);

        const koi = s.add.text(s.width/2 - 150, s.height/2 + 140, "Koikoi", {
            fontSize: "36px", backgroundColor: "#0066cc", padding: 8, color:"#fff"
        }).setOrigin(0.5).setInteractive().setDepth(10002);

        const shobu = s.add.text(s.width/2 + 150, s.height/2 + 140, "Shobu", {
            fontSize: "36px", backgroundColor: "#aa0022", padding: 8, color:"#fff"
        }).setOrigin(0.5).setInteractive().setDepth(10002);

        koi.on("pointerdown", () => { this.close(); onKoiKoi(); });
        shobu.on("pointerdown", () => { this.close(); onShobu(points); });

        this.popup = { overlay, box, title, yText, pText, koi, shobu };
    }

    showEnemy(yaku, points, onContinue) {
        this.close();
        const s = this.scene;

        const overlay = s.add.rectangle(s.width/2, s.height/2, s.width, s.height, 0x000000, 0.6)
            .setDepth(9000).setInteractive();

        const box = s.add.rectangle(s.width/2, s.height/2, 900, 420, 0xffffff)
            .setStrokeStyle(6, 0xaa0000).setDepth(10000);

        const title = s.add.text(s.width/2, s.height/2 - 120,
            "El oponente consiguio un Yaku",
            { fontSize:"40px", color:"#000" }
        ).setOrigin(0.5).setDepth(10001);

        const yText = s.add.text(s.width/2, s.height/2 - 30,
            "Combinacion: " + yaku,
            { fontSize:"32px", color:"#000" }
        ).setOrigin(0.5).setDepth(10001);

        const pText = s.add.text(s.width/2, s.height/2 + 40,
            "Puntos: " + points,
            { fontSize:"28px", color:"#333" }
        ).setOrigin(0.5).setDepth(10001);

        this.popup = { overlay, box, title, yText, pText };

        s.time.delayedCall(1200, () => { this.close(); onContinue(); });
    }
}
