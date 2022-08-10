import type { PrismaClient } from '@prisma/client'
import { Buffer } from 'node:buffer'

export const extendDeck = (decks: PrismaClient['deck']) =>
  Object.assign(decks, {
    getByDeckcode: async (deckcode: string) => {
      return await decks.findUnique({ where: { deckcode } })
    },
    resolveDeckcodeOrShortid: async (deckcodeOrShortid: string) =>
      await decks.findFirst({
        select: { shortid: true, deckcode: true },
        where: { OR: [{ deckcode: deckcodeOrShortid }, { shortid: deckcodeOrShortid }] },
      }),
    render: async (deckcodeOrShortid: string): Promise<Buffer | null> => {
      const query = `deckcode=${encodeURIComponent(deckcodeOrShortid)}`
      const response = await fetch(
        `https://duelyst-deck-renderer.azurewebsites.net/api/render?${query}`,
        { method: 'POST' },
      )

      if (response.ok) {
        const blob = await response.blob()
        return Buffer.from(await blob.arrayBuffer())
      }
      return null
    },
  })
