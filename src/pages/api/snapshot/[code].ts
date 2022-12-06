import { isShareOrDeckcode } from '@/common/utils'
import { createSSRClient } from '@/server'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = (req.query.code as string | undefined)?.trim() ?? ''

  if (!isShareOrDeckcode(code)) {
    return res.status(400).send('invalid deckcode or share code')
  }

  const client = await createSSRClient({ req, res })
  const image = await client.deckImage.ensure({ code })

  if (image === null) {
    return res.status(404).send('image not found')
  }

  res.setHeader('Content-Type', 'image/png').send(image)
}
