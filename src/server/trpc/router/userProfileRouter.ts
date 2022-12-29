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
      const user = await ctx.user.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          name: true,
          image: true,
        },
      })

      if (!user) return null

      const totalDecklysts = await ctx.decklyst.count({
        where: { authorId: input.id },
      })

      return { ...user, totalDecklysts }
    }),
  all: proc
    .input(
      z.object({
        onlyAuthors: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const authors = await ctx.user.findMany({
        where: { decklysts: input.onlyAuthors ? { some: { privacy: 'public' } } : undefined },
        select: { id: true, name: true },
      })
      return authors
    }),
})
