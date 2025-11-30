
import { getCardFlags } from "./HanafudaCardType.js";

export function calculateYakus(pairs) 
{
     if (!pairs || pairs.length === 0) {
        return { yakus: [], points: 0 };
    }
    let specialCount = 0;
    let ribbonCount  = 0;
    let basicCount   = 0;

    const monthCount = new Array(12).fill(0);

    for (const card of pairs) {
        const { special, ribbon, basic } = getCardFlags(card);
         if (!card) continue;
        if (special)
            {
                specialCount++;
            }
        if (ribbon) 
            {
                ribbonCount++;
            }
        if (basic) {

            basicCount++;
        }

        monthCount[card.month]++;
    }
    const yakus = [];
    let points = 0;
    if (specialCount >= 5) 
    {
        yakus.push("Tane");
        points += 3;
    }

    if (ribbonCount >= 3) 
        {
        yakus.push("Kajin");
        points += 3;
    }

     const ryujinComb = monthCount.some(c => c >= 4);
     if (ryujinComb) {
        yakus.push("Ryujin");
        points += 4;
    }

    if (basicCount >= 12) {
        yakus.push("Fujin");
        points += 2;
    }
    const seasons = {
        spring: [0, 1, 2],
        summer: [3, 4, 5],
        autumn: [6, 7, 8],
        winter: [9, 10, 11]
    };
    let doujinComb = false;
    for (const season of Object.values(seasons)) {
        if (season.every(m => monthCount[m] > 0)) {
            doujinComb = true;
            break;
        }
    }
    if (doujinComb) {
        yakus.push("Doujin");
        points += 2;
    }

    return { points, yakus };

}