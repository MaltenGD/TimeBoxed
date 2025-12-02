
export function getCardFlags(card) 
{
    const n = card.number;

    const special = (n % 4 === 0); 
    const ribbon  = (n % 4 === 1);
    const basic   = !special && !ribbon;

    return { special, ribbon, basic };
}