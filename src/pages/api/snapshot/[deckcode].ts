// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { normalizeDeckcode, validateDeckcode } from '@/common/deckcode'
import { createContext } from '@/server/context'
import { serverRouter } from '@/server/router'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const deckcode = normalizeDeckcode(req.query.deckcode as string | undefined)

  if (!validateDeckcode(deckcode)) {
    return res.status(400).send('invalid deckcode')
  }

  const client = serverRouter.createCaller(await createContext())

  await client.mutation('ensureDeckinfo', { code: deckcode })

  const image =
    (await client.query('getDeckimage', { deckcode, timeout: 4000 })) ??
    (await client.mutation('renderDeckimage', { deckcode }))

  res.setHeader('Content-Type', 'image/png').send(image)
}
