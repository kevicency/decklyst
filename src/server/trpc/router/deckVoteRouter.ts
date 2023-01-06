import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { proc, router, secureProc } from '../trpc'

export const deckVoteRouter = router({
  getMyVote: proc
    .input(z.object({ sharecode: z.string() }))
    .query(async ({ ctx, input: { sharecode } }) => {
      const userId = ctx.session?.user?.id

      return userId
        ? ctx.deckVote.findUnique({
            where: { sharecode_userId: { sharecode, userId } },
          })
        : null
    }),
  toggleUpvote: secureProc
    .input(z.object({ sharecode: z.string() }))
    .mutation(async ({ ctx, input: { sharecode } }) => {
      const userId = ctx.session.user.id

      const decklyst = await ctx.prisma.decklyst.findUnique({ where: { sharecode } })

      if (decklyst?.authorId === userId) {
        throw new TRPCError({ message: 'Voting for own decks not allowed', code: 'FORBIDDEN' })
      }

      const existingVote = await ctx.prisma.deckVote.findUnique({
        where: { sharecode_userId: { sharecode, userId } },
      })

      const [vote, delta] =
        existingVote?.vote === -1 ? [1, 2] : existingVote?.vote === 1 ? [0, -1] : [1, 1]

      await ctx.prisma.deckVote.upsert({
        where: { sharecode_userId: { sharecode, userId } },
        create: {
          sharecode,
          userId,
          vote,
        },
        update: {
          vote,
        },
      })
      await ctx.prisma.decklyst.update({
        where: { sharecode },
        data: { likes: { increment: delta } },
      })
    }),
  // const vote = await ctx.prisma.deckVote.upsert({
  //   where: {
  //     sharecode_ipAddress_userId: {
  //       sharecode,
  //       ipAddress,
  //       userId,
  //     },
  //   },
  //   create: {
  //     sharecode,
  //     ipAddress,
  //     userId,
  //     vote,
  //   },
  //   update: {
  //     vote,
  //   },
  // })
})
