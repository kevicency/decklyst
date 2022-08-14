import { parseDeckcode, validateDeckcode } from '@/common/deckcode'
import { generateShortid } from '@/server/shortid'
import * as trpc from '@trpc/server'
import { z } from 'zod'
import type { Context } from './context'

const IMAGE_VERSION = '2.1' // TODO: use git commit hash?

export const serverRouter = trpc
  .router<Context>()
  .query('getDeck', {
    input: z.object({
      deckcode: z.string(),
    }),
    resolve: async ({ input, ctx }) => await ctx.deck.getByDeckcode(input.deckcode),
  })

  .query('getDeckImage', {
    input: z.object({
      deckcode: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      let run = 0

      while (run < 10) {
        const deck = await ctx.deck.findUnique({ where: { deckcode: input.deckcode } })

        if (deck == null) return null

        const image = deck.imageVersion === IMAGE_VERSION ? deck.image : null

        if (image) return image

        if (
          deck.imageRenderStart &&
          Date.now() - (deck.imageRenderStart as unknown as number) < 5000
        ) {
          await new Promise((resolve) => setTimeout(resolve, 500))
        } else {
          return null
        }

        run += 1
      }

      return null
    },
  })
  .query('resolveDeckcodeOrShortid', {
    input: z.object({
      deckcodeOrShortid: z.string(),
    }),
    resolve: async ({ input: { deckcodeOrShortid }, ctx }) => {
      return await ctx.deck.resolveDeckcodeOrShortid(deckcodeOrShortid)
    },
  })
  .query('recentDeckcodes', {
    input: z.number().gt(0).optional(),
    resolve: async ({ input: count, ctx }) => {
      const result = await ctx.deck.findMany({
        select: { deckcode: true },
        orderBy: { createdAt: 'desc' },
        take: count ?? 3,
      })
      return result.map((x) => x.deckcode)
    },
  })
  .mutation('ensureDeckcodeOrShortid', {
    input: z.object({
      deckcodeOrShortid: z.string(),
    }),
    resolve: async ({ input: { deckcodeOrShortid }, ctx }) => {
      const deck = ctx.deck.resolveDeckcodeOrShortid(deckcodeOrShortid)

      if (deck) return deck

      const parsedDeck = validateDeckcode(deckcodeOrShortid)
        ? parseDeckcode(deckcodeOrShortid)
        : null

      if (parsedDeck === null) return null

      const shortid = await generateShortid(ctx)
      return await ctx.deck.create({
        select: { shortid: true, deckcode: true },
        data: { deckcode: parsedDeck.deckcode, shortid },
      })
    },
  })
  .mutation('renderDeckImage', {
    input: z.object({
      deckcode: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      const { deckcode } = await ctx.deck.upsert({
        select: { shortid: true, deckcode: true },
        where: { deckcode: input.deckcode },
        update: { imageRenderStart: Date.now() },
        create: {
          deckcode: input.deckcode,
          shortid: await generateShortid(ctx),
          imageRenderStart: Date.now(),
        },
      })

      let image: Buffer | null = null
      try {
        image = await ctx.deck.render(deckcode)
      } catch (e) {
        console.error(e)
      }
      await ctx.deck.update({
        where: { deckcode },
        data: Object.assign(
          { imageRenderStart: 0 },
          image ? { image, imageVersion: IMAGE_VERSION } : { image: null, imageVersion: '0' },
        ),
      })

      return image
    },
  })

export type ServerRouter = typeof serverRouter
