import type { Prisma, PrismaClient } from '@prisma/client'
import { addDays } from 'date-fns'
import type { ModelContext } from './context'

export const extendDeckView = (deckView: PrismaClient['deckView'], _ctx: ModelContext) => {
  return Object.assign(deckView, {
    mostViewed: async ({
      take,
      sinceDaysAgo,
      decklystFilter,
    }: {
      take: number
      sinceDaysAgo?: number
      decklystFilter?: Prisma.DecklystWhereInput
    }) => {
      const result = await deckView.groupBy({
        where: {
          decklyst: decklystFilter,
          updatedAt: sinceDaysAgo
            ? {
                gte: addDays(new Date(), -Math.abs(sinceDaysAgo)),
              }
            : undefined,
        },
        by: ['sharecode'],
        _count: {
          sharecode: true,
        },
        orderBy: {
          _count: {
            sharecode: 'desc',
          },
        },
        take,
      })

      return result.map(({ sharecode, _count }) => ({ sharecode, viewCount: _count.sharecode }))
    },
  })
}
