import type { PrismaClient } from '@prisma/client'
import { differenceInMilliseconds } from 'date-fns'
import type { Buffer } from 'node:buffer'

type Deckimage = PrismaClient['deckimage']

export const DECK_IMAGE_VERSION = '1.1'

export const extendDeckimage = (deckimage: Deckimage) =>
  Object.assign(deckimage, {
    findByDeckcode: async (deckcode: string, renderTimeout: number = 0) => {
      let isRendering = true

      while (isRendering) {
        const image = await deckimage.findUnique({ where: { deckcode } })

        if (image == null) return null
        if (image.bytes && image.version === DECK_IMAGE_VERSION) return image.bytes

        isRendering =
          image.renderStartedAt !== null &&
          differenceInMilliseconds(new Date(), image.renderStartedAt) < renderTimeout
      }

      return null
    },
    startRendering: async (deckcode: string) => {
      const update = {
        renderStartedAt: new Date(),
        renderedAt: null,
        bytes: null,
        version: DECK_IMAGE_VERSION,
      }
      await deckimage.upsert({
        select: { deckcode: true },
        where: { deckcode },
        update,
        create: { deckcode, ...update },
      })
    },
    finishRendering: async (deckcode: string, bytes: Buffer | null) => {
      await deckimage.update({
        select: { deckcode: true },
        where: { deckcode },
        data: bytes
          ? { bytes, renderedAt: new Date() }
          : { bytes: null, renderStartedAt: null, version: null },
      })
      return bytes
    },
  })
