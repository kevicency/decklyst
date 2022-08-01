// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { normalizeDeckcode, validateDeckcode } from '../../../lib/deckcode'
import absoluteUrl from 'next-absolute-url'
import { createContext } from '../../../server/context'
import { serverRouter } from '../../../server/router'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { origin } = absoluteUrl(req)
  const deckcode = normalizeDeckcode(req.query.deckcode as string | undefined)
  const renderUrl = `${origin}/api/render/${encodeURIComponent(deckcode ?? '')}`

  if (!validateDeckcode(deckcode)) {
    return res.status(404).send('')
  }

  const ctx = await createContext()
  const client = serverRouter.createCaller(ctx)

  const deck = await client.mutation('ensureDeck', { deckcode })
  let imageBuffer = deck?.image

  if (!imageBuffer) {
    const blob = await fetch(renderUrl).then((response) => response.blob())
    imageBuffer = Buffer.from(await blob.arrayBuffer())
    await client.mutation('upsertDeckImage', { imageBytes: imageBuffer, deckcode })
  }

  res.setHeader('Content-Type', 'image/png')
  res.send(imageBuffer)
}
