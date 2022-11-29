import { isSameSecond } from 'date-fns'
import { z } from 'zod'
import { proc, router } from '../trpc'

export const deckViewRouter = router({
  registerView: proc
    .input(z.object({ sharecode: z.string() }))
    .mutation(async ({ ctx, input: { sharecode } }) => {
      const ipAddress = (ctx.session?.user?.id ? undefined : ctx.ipAddress) ?? ''
      const userId = ctx.session?.user?.id ?? 'anonymous'

      const view = await ctx.prisma.deckView.upsert({
        where: {
          sharecode_ipAddress_userId: {
            sharecode,
            ipAddress,
            userId,
          },
        },
        create: {
          sharecode,
          ipAddress,
          userId,
          views: 1,
        },
        update: {
          views: { increment: 1 },
        },
      })

      if (isSameSecond(view.createdAt, view.updatedAt)) {
        await ctx.decklyst.update({
          where: { sharecode },
          data: { views: { increment: 1 } },
        })
      }
    }),
})
