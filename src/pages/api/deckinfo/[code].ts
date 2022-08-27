// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createContext } from '@/server/context'
import { serverRouter } from '@/server/router'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = (req.query.code as string | undefined)?.trim()

  if (!code) {
    return res.status(400).send('invalid deckcode or share code')
  }

  const client = serverRouter.createCaller(await createContext())
  const deckinfo = await client.query('getDeckinfo', { code })

  if (deckinfo === null) {
    return res.status(404).send('deckinfo not found')
  }

  res.send(deckinfo)
}
