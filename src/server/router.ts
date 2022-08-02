import * as trpc from '@trpc/server'
import { Buffer } from 'node:buffer'
import { z } from 'zod'
import type { Context } from './context'

const IMAGE_VERSION = '0' // TODO: use git commit hash?

export const serverRouter = trpc
  .router<Context>()
  .query('getDeck', {
    input: z.object({
      deckcode: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      return await ctx.prisma.deck.findUnique({ where: { deckcode: input.deckcode } })
    },
  })
  .query('getDeckImage', {
    input: z.object({
      deckcode: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      const deck = await ctx.prisma.deck.findUnique({ where: { deckcode: input.deckcode } })
      if (deck?.imageVersion !== IMAGE_VERSION) {
        return null
      }
      return deck.image
    },
  })
  .mutation('ensureDeck', {
    input: z.object({
      deckcode: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      const deck = await ctx.prisma.deck.findUnique({ where: { deckcode: input.deckcode } })

      return (
        deck ??
        (await ctx.prisma.deck.create({
          data: { deckcode: input.deckcode },
        }))
      )
    },
  })
  .mutation('upsertDeckImage', {
    input: z.object({
      deckcode: z.string(),
      imageBytes: z.instanceof(Buffer),
    }),
    resolve: async ({ input, ctx }) => {
      const update = { image: input.imageBytes, imageVersion: IMAGE_VERSION }
      await ctx.prisma.deck.upsert({
        where: { deckcode: input.deckcode },
        update,
        create: { deckcode: input.deckcode, ...update },
      })
    },
  })

export type ServerRouter = typeof serverRouter
