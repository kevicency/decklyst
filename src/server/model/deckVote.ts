import type { Prisma, PrismaClient } from '@prisma/client'
import { addDays } from 'date-fns'
import type { ModelContext } from './context'

export const extendDeckVote = (deckVote: PrismaClient['deckVote'], _ctx: ModelContext) => {
  return Object.assign(deckVote, {
    mostLiked: async ({
      take,
      skip,
      sinceDaysAgo,
      decklystFilter,
    }: {
      take: number
      skip: number
      sinceDaysAgo?: number
      decklystFilter?: Prisma.DecklystWhereInput
    }) => {
      const result = await deckVote.groupBy({
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
        skip,
      })

      return result.map(({ sharecode, _count }) => ({ sharecode, likeCount: _count.sharecode }))
    },
  })
}
