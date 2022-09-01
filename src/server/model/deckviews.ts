import type { PrismaClient } from '@prisma/client'
import { addDays } from 'date-fns'

type Deckviews = PrismaClient['deckviews']

type DeckviewResult = { deckcode: string; viewCount: number }

export const extendDeckviews = (deckviews: Deckviews) =>
  Object.assign(deckviews, {
    incrementViewCount: async (deckcode: string, ipAddress: string) =>
      await deckviews.upsert({
        where: { deckcode_ipAddress: { deckcode, ipAddress } },
        create: {
          deckcode,
          ipAddress,
        },
        update: {
          viewCount: {
            increment: 1,
          },
        },
      }),
    mostViewed: async ({
      count: take,
      sinceDaysAgo,
      faction,
    }: {
      count: number
      sinceDaysAgo?: number
      faction?: string
    }): Promise<DeckviewResult[]> => {
      const result = await deckviews.groupBy({
        where: {
          info: {
            totalCount: 40,
            faction: faction || undefined,
          },
          ...(sinceDaysAgo && {
            updatedAt: {
              gte: addDays(new Date(), -Math.abs(sinceDaysAgo)),
            },
          }),
        },
        by: ['deckcode'],
        _count: {
          deckcode: true,
        },
        orderBy: {
          _count: {
            deckcode: 'desc',
          },
        },
        take,
      })

      return result.map(({ deckcode, _count }) => ({ deckcode, viewCount: _count.deckcode }))
    },
    getDeckviews: async (...deckcodes: string[]): Promise<DeckviewResult[]> => {
      const result = await deckviews.groupBy({
        where: {
          deckcode: { in: deckcodes },
        },
        by: ['deckcode'],
        _count: {
          deckcode: true,
        },
        orderBy: {
          _count: {
            deckcode: 'desc',
          },
        },
        take: 1,
      })

      return result.map(({ deckcode, _count }) => ({ deckcode, viewCount: _count.deckcode }))
    },
  })
