// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { normalizeDeckcode } from '@/common/deckcode'
import { createContext } from '@/server/context'
import { serverRouter } from '@/server/router'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const deckcode = normalizeDeckcode(req.query.deckcode as string | undefined)

  const client = serverRouter.createCaller(await createContext())

  const image = deckcode ? await client.mutation('ensureDeckimage', { deckcode }) : null

  if (image === null) {
    return res.status(400).send('invalid deckcode')
  }

  res.setHeader('Content-Type', 'image/png').send(image)
}
