import { factions } from '@/data/cards'
import { z } from 'zod'
import { proc, router } from '../trpc'

export const decksRouter = router({
  latest: proc
    .input(
      z.object({
        count: z.number().gt(0).lte(25),
        faction: z.enum(factions as [string, ...string[]]).optional(),
      }),
    )
    .query(async ({ ctx, input: { faction, count } }) => {
      const deckinfos = await ctx.deckinfo.findMany({
        select: { deckcode: true, createdAt: true },
        where: {
          totalCount: 40,
          faction: faction || undefined,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: count,
      })
      const viewCounts = await ctx.deckviews.getDeckviews(
        ...deckinfos.map(({ deckcode }) => deckcode),
      )

      return deckinfos.map(({ deckcode, createdAt }) => ({
        deckcode,
        meta: { createdAt, viewCount: viewCounts[deckcode] || 1 },
      }))
    }),
  mostViewed: proc
    .input(
      z.object({
        count: z.number().gt(0).lte(25),
        sinceDaysAgo: z.number().optional(),
        faction: z.enum(factions as [string, ...string[]]).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const mostViewedDeckcodes = await ctx.deckviews.mostViewed(input)
      return mostViewedDeckcodes.map(({ deckcode, viewCount }) => ({
        deckcode,
        meta: { viewCount },
      }))
    }),

  search: proc
    .input(
      z.object({
        limit: z.number().gt(0).lte(50).optional(),
        cursor: z.number().optional(),
        filters: z
          .object({
            faction: z.array(z.enum(factions as [string, ...string[]])).optional(),
          })
          .optional(),
        // faction: z.enum(factions as [string, ...string[]]).optional(),
      }),
    )
    .query(async ({ ctx, input: { limit = 50, cursor: page = 0, filters = {} } }) => {
      const skip = limit * page

      const deckinfos = await ctx.deckinfo.findMany({
        select: { deckcode: true, createdAt: true },
        where: {
          totalCount: 40,
          faction: filters.faction?.length ? { in: filters.faction } : undefined,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      })
      const viewCounts = await ctx.deckviews.getDeckviews(
        ...deckinfos.map(({ deckcode }) => deckcode),
      )

      return deckinfos.map(({ deckcode, createdAt }) => ({
        deckcode,
        meta: { createdAt, viewCount: viewCounts[deckcode] || 1 },
      }))
    }),
  // mostViewedInfinite: proc
  //   .input(
  //     z.object({
  //       limit: z.number().min(1).max(50).nullish(),
  //       cursor: z.number().nullish(),
  //     }),
  //   )
  //   .query(async ({ ctx, input }) => {
  //     const mostViewedDeckcodes = await ctx.deckviews.mostViewed(input)
  //     return mostViewedDeckcodes.map(({ deckcode, viewCount }) => ({
  //       deckcode,
  //       meta: { viewCount },
  //     }))
  //   }),
})
