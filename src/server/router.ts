import { parseDeckcode, validateDeckcode } from '@/common/deckcode'
import { siteUrl } from '@/common/urls'
import * as trpc from '@trpc/server'
import { difference } from 'lodash'
import { nanoid } from 'nanoid'
import { Buffer } from 'node:buffer'
import { z } from 'zod'
import type { Context } from './context'

const IMAGE_VERSION = '1' // TODO: use git commit hash?

const generateShortid = async (ctx: Context, size = 3): Promise<string> => {
  const candidates = new Array(15).fill(0).map(() => nanoid(size))
  const taken = await ctx.prisma.deck.findMany({
    select: { shortid: true },
    where: {
      shortid: { in: candidates },
    },
  })
  const shortid = difference(
    candidates,
    taken.map((d) => d.shortid),
  )[0]

  return shortid ?? (await generateShortid(ctx, size + 1))
}

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

      while (run < 10) {
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
      deckcodeOrShortid: z.string(),
    }),
    resolve: async ({ input: { deckcodeOrShortid }, ctx }) => {
      const deck = await ctx.prisma.deck.findFirst({
        select: { shortid: true, deckcode: true },
        where: { OR: [{ deckcode: deckcodeOrShortid }, { shortid: deckcodeOrShortid }] },
      })

      if (deck) return deck

      const parsedDeck = validateDeckcode(deckcodeOrShortid)
        ? parseDeckcode(deckcodeOrShortid)
        : null

      if (parsedDeck === null) return null

      const shortid = await generateShortid(ctx)
      return await ctx.prisma.deck.create({
        data: { deckcode: parsedDeck.deckcode, shortid },
      })
    },
  })
  .mutation('renderDeckImage', {
    input: z.object({
      deckcode: z.string(),
      origin: z.string(), // TODO: use env variable?
    }),
    resolve: async ({ input: { deckcode, origin }, ctx }) => {
      const shortid = await generateShortid(ctx)
      await ctx.prisma.deck.upsert({
        where: { deckcode },
        update: { imageRendering: true },
        create: { deckcode, shortid, imageRendering: true },
      })

      try {
        const renderUrl = `${siteUrl}/api/render/${encodeURIComponent(deckcode ?? '')}`
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
