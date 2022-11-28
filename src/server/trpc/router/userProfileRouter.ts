import { z } from 'zod'
import { proc, router } from '../trpc'

export const userProfileRouter = router({
  get: proc
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.user.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          name: true,
          image: true,
          decklysts: {
            where: { privacy: input.id === ctx.session?.user?.id ? undefined : 'public' },
            take: 10,
            orderBy: { updatedAt: 'desc' },
            include: { author: true },
          },
        },
      })
    }),
})
