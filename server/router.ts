import * as trpc from '@trpc/server'
import { z } from 'zod'
import { Buffer } from 'node:buffer'
import { Context } from './context'

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
  .query('getDeckImageDataUrl', {
    input: z.object({
      deckcode: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      const mime = 'image/png'
      const encoding = 'base64'
      const deck = await ctx.prisma.deck.findUnique({ where: { deckcode: input.deckcode } })
      if (!deck?.image) return null
      const buffer = deck.image as Buffer
      return `data:${mime};${encoding},${buffer.toString('base64')}`
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
      await ctx.prisma.deck.upsert({
        where: { deckcode: input.deckcode },
        update: { image: input.imageBytes },
        create: { deckcode: input.deckcode, image: input.imageBytes },
      })
    },
  })

export type ServerRouter = typeof serverRouter
