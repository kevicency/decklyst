import type { PrismaClient } from '@prisma/client'
import { addWeeks } from 'date-fns'

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
      recent,
    }: {
      count: number
      recent?: boolean
    }): Promise<DeckviewResult[]> => {
      const result = await deckviews.groupBy({
        where: recent
          ? {
              updatedAt: {
                gte: addWeeks(new Date(), -1),
              },
            }
          : undefined,
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
    getDeckviews: async (deckcode: string): Promise<DeckviewResult | null> => {
      const result = await deckviews.groupBy({
        where: {
          deckcode,
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
      if (result[0]) {
        return { deckcode: result[0].deckcode, viewCount: result[0]._count.deckcode }
      }

      return null
    },
  })
