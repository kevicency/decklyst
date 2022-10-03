import { factions } from '@/data/cards'
import { z } from 'zod'
import { t } from '../trpc'

export const decksRouter = t.router({
  latest: t.procedure
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
  mostViewed: t.procedure
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
})
