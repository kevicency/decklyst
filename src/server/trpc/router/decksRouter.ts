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
        sorting: z.enum(['date:created', 'views:all', 'views:recent']).optional(),
        filters: z
          .object({
            factions: z.array(z.enum(factions as [string, ...string[]])),
          })
          .optional(),
      }),
    )
    .query(
      async ({
        ctx,
        input: { limit = 10, cursor: page = 0, filters = { factions: [] }, sorting },
      }) => {
        const skip = limit * page

        if (sorting === 'date:created' || sorting === undefined) {
          const deckinfos = await ctx.deckinfo.findMany({
            select: { deckcode: true, createdAt: true, views: {} },
            where: {
              totalCount: 40,
              faction: filters.factions?.length ? { in: filters.factions } : undefined,
            },
            orderBy: {
              createdAt: 'desc',
            },
            skip,
            take: limit + 1,
          })
          const viewCounts = await ctx.deckviews.getDeckviews(
            ...deckinfos.map(({ deckcode }) => deckcode),
          )
          const hasMore = deckinfos.length === limit + 1

          return {
            hasMore,
            decks: deckinfos.slice(0, hasMore ? -1 : undefined).map(({ deckcode, createdAt }) => ({
              deckcode,
              meta: { createdAt, viewCount: viewCounts[deckcode] || 1 },
            })),
          }
        } else {
          const mostViewedDeckcodes = await ctx.deckviews.mostViewed({
            count: limit + 1,
            sinceDaysAgo: sorting === 'views:recent' ? 7 : undefined,
            factions: filters.factions,
          })
          const deckinfos = await ctx.deckinfo.findMany({
            select: { deckcode: true, createdAt: true },
            where: {
              deckcode: { in: mostViewedDeckcodes.map(({ deckcode }) => deckcode) },
            },
          })
          const createdDates = new Map(
            deckinfos.map(({ deckcode, createdAt }) => [deckcode, createdAt]),
          )
          const hasMore = mostViewedDeckcodes.length === limit + 1

          return {
            decks: mostViewedDeckcodes
              .slice(0, hasMore ? -1 : undefined)
              .map(({ deckcode, viewCount }) => ({
                deckcode,
                meta: { viewCount, createdAt: createdDates.get(deckcode) },
              })),
            hasMore,
          }
        }
      },
    ),
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
