import { transformer } from '@/common/transformer'
import { parseDeckcode, validateDeckcode } from '@/data/deckcode'
import { snapshot } from '@/server/snapshot'
import * as trpc from '@trpc/server'
import type { Buffer } from 'node:buffer'
import { z } from 'zod'
import type { Context } from './context'

export const serverRouter = trpc
  .router<Context>()
  .transformer(transformer)
  .query('getDeckinfo', {
    input: z.object({
      code: z.string(),
    }),
    resolve: async ({ input, ctx }) => await ctx.deckinfo.findByCode(input.code),
  })
  .mutation('ensureDeckinfo', {
    input: z.object({
      code: z.string(),
    }),
    resolve: async ({ input: { code }, ctx }) => ctx.deckinfo.ensureDeckinfo(code),
  })
  .query('getDeckimage', {
    input: z.object({
      deckcode: z.string(),
      timeout: z.number().optional(),
    }),
    resolve: async ({ input: { deckcode, timeout }, ctx }) => {
      return await ctx.deckimage.findByDeckcode(deckcode, timeout)
    },
  })
  .query('getDeckviews', {
    input: z.object({
      deckcodes: z.array(z.string()),
    }),
    resolve: async ({ input: { deckcodes }, ctx }) =>
      await ctx.deckviews.getDeckviews(...deckcodes),
  })

  .mutation('ensureDeckimage', {
    input: z.object({
      deckcode: z.string(),
      forceRender: z.boolean().optional(),
      timeout: z.number().optional(),
    }),
    resolve: async ({ input: { deckcode, timeout, forceRender }, ctx }) => {
      let image: Buffer | null = forceRender
        ? null
        : await ctx.deckimage.findByDeckcode(deckcode, timeout ?? 25000)

      if (image !== null) return image

      const deck = validateDeckcode(deckcode) ? parseDeckcode(deckcode) : null

      if (deck === null) return null

      const [deckinfo] = await Promise.all([
        await ctx.deckinfo.ensureDeckinfo(deckcode),
        await ctx.deckimage.startRendering(deckcode),
      ])

      image = deckinfo ? await snapshot(deckcode) : null

      return await ctx.deckimage.finishRendering(deckcode, image)
    },
  })
  .query('decks.mostViewed', {
    input: z.object({
      count: z.number().gt(0).lte(25),
      sinceDaysAgo: z.number().optional(),
    }),
    resolve: async ({ input, ctx }) => {
      const mostViewedDeckcodes = await ctx.deckviews.mostViewed(input)

      return mostViewedDeckcodes.map(({ deckcode, viewCount }) =>
        // createDeckExpanded(deckcode, { viewCount }),
        ({ deckcode, meta: { viewCount } }),
      )
    },
  })
  .query('decks.latest', {
    input: z.object({
      count: z.number().gt(0).lte(25),
    }),
    resolve: async ({ input: { count }, ctx }) => {
      const deckinfos = await ctx.deckinfo.findMany({
        select: { deckcode: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: count,
      })
      const viewCounts = await ctx.deckviews.getDeckviews(
        ...deckinfos.map(({ deckcode }) => deckcode),
      )
      const viewCountMap = new Map(
        viewCounts.map(({ deckcode, viewCount }) => [deckcode, viewCount]),
      )

      return deckinfos.map(({ deckcode, createdAt }) => ({
        deckcode,
        meta: { createdAt, viewCount: viewCountMap.get(deckcode) ?? 1 },
      }))
    },
  })
  .mutation('registerView', {
    input: z.object({
      deckcode: z.string(),
      ipAddress: z.string(),
    }),
    resolve: async ({ input: { deckcode, ipAddress }, ctx }) =>
      await ctx.deckviews.incrementViewCount(deckcode, ipAddress),
  })

export type ServerRouter = typeof serverRouter
