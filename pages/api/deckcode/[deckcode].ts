// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {CardData, cardData} from "../../../data/cards";
import {parseDeckcode, validateDeckcode, DeckData} from "../../../lib/deckcode";

const cardDataById = cardData.reduce((acc, cardData) => ({
    ...acc,
    [cardData.id]: cardData
}), {} as Record<number, CardData>);


export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<DeckData | { error: string }>
) {
    const deckcode = req.query.deckcode as string | undefined;

    if (validateDeckcode(deckcode)) {
        res.status(200).json(parseDeckcode(deckcode))
    } else {
        res.status(400).json({error: 'Invalid deckcode provided'})
    }
}
