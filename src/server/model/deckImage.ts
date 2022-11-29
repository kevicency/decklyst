import type { PrismaClient } from '@prisma/client'
import { differenceInMilliseconds } from 'date-fns'
import type { Buffer } from 'node:buffer'

type DeckImage = PrismaClient['deckImage']

export const DECK_IMAGE_VERSION = '2.0'

export const extendDeckImage = (deckImage: DeckImage) =>
  Object.assign(deckImage, {
    findBySharecode: async (sharecode: string, renderTimeout: number = 0) => {
      let isRendering = true

      while (isRendering) {
        const image = await deckImage.findUnique({ where: { sharecode } })

        if (image == null) return null
        if (image.bytes && image.version === DECK_IMAGE_VERSION) return image.bytes

        isRendering =
          image.renderStartedAt !== null &&
          differenceInMilliseconds(new Date(), image.renderStartedAt) < renderTimeout

        await new Promise((resolve) => setTimeout(resolve, 250))
      }

      return null
    },
    startRendering: async (sharecode: string, deckcode: string) => {
      const update = {
        renderStartedAt: new Date(),
        renderedAt: null,
        bytes: null,
        version: DECK_IMAGE_VERSION,
      }
      await deckImage.upsert({
        select: { sharecode: true },
        where: { sharecode },
        update,
        create: { sharecode, deckcode, ...update },
      })
    },
    finishRendering: async (sharecode: string, bytes: Buffer | null) => {
      await deckImage.update({
        select: { sharecode: true },
        where: { sharecode },
        data: bytes
          ? { bytes, renderedAt: new Date() }
          : { bytes: null, renderStartedAt: null, version: null },
      })
      return bytes
    },
  })
