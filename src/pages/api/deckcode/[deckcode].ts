// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  DeckData,
  normalizeDeckcode,
  parseDeckcode,
  validateDeckcode,
} from '../../../common/deckcode'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DeckData | { error: string }>,
) {
  const deckcode = normalizeDeckcode(req.query.deckcode as string | undefined)
  const deckData = validateDeckcode(deckcode) ? parseDeckcode(deckcode) : null

  if (deckData) {
    res.status(200).json(deckData)
  } else {
    res.status(400).json({ error: 'Invalid deckcode provided' })
  }
}
