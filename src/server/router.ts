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
      let run = 0

      while (run < 5) {
        const deck = await ctx.prisma.deck.findUnique({ where: { deckcode: input.deckcode } })
        const image = deck?.imageVersion === IMAGE_VERSION ? deck?.image ?? null : null

        if (image) return image

        if (deck?.imageRendering) {
          await new Promise((resolve) => setTimeout(resolve, 500))
        } else {
          return null
        }

        run += 1
      }

      return null
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
  .mutation('renderDeckImage', {
    input: z.object({
      deckcode: z.string(),
      origin: z.string(), // TODO: use env variable?
    }),
    resolve: async ({ input: { deckcode, origin }, ctx }) => {
      await ctx.prisma.deck.upsert({
        where: { deckcode },
        update: { imageRendering: true },
        create: { deckcode, imageRendering: true },
      })

      try {
        const renderUrl = `${origin}/api/render/${encodeURIComponent(deckcode ?? '')}`
        const blob = await fetch(renderUrl).then((response) => response.blob())
        const image = Buffer.from(await blob.arrayBuffer())

        await ctx.prisma.deck.update({
          where: { deckcode },
          data: { deckcode, image, imageVersion: IMAGE_VERSION, imageRendering: false },
        })
        return image
      } catch (e) {
        await ctx.prisma.deck.update({
          where: { deckcode },
          data: { deckcode, imageRendering: false },
        })
      }

      return null
    },
  })

export type ServerRouter = typeof serverRouter
