import type { PrismaClient } from '@prisma/client'
import type { Buffer } from 'node:buffer'

type Deckimage = PrismaClient['deckimage']

export const DECK_IMAGE_VERSION = '1.1'

export const extendDeckimage = (deckimage: Deckimage) =>
  Object.assign(deckimage, {
    findByDeckcode: async (deckcode: string) => await deckimage.findUnique({ where: { deckcode } }),
    startRendering: async (deckcode: string) => {
      const update = { renderedAt: new Date(), bytes: null, version: DECK_IMAGE_VERSION }
      await deckimage.upsert({
        select: { deckcode: true },
        where: { deckcode },
        update,
        create: { deckcode, ...update },
      })
    },
    finishRendering: async (deckcode: string, buffer: Buffer | null) => {
      await deckimage.update({
        select: { deckcode: true },
        where: { deckcode },
        data: buffer ? { bytes: buffer } : { bytes: null, renderedAt: null, version: null },
      })
      return buffer
    },
  })
