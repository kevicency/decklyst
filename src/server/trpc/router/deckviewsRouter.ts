import { z } from 'zod'
import { proc, router } from '../trpc'

export const deckviewsRouter = router({
  get: proc
    .input(z.object({ deckcode: z.string() }))
    .query(
      async ({ input: { deckcode }, ctx }) =>
        (await ctx.deckviews.getDeckviews(deckcode))[deckcode] ?? 0,
    ),
  getAll: proc
    .input(z.object({ deckcodes: z.array(z.string()) }))
    .query(async ({ input: { deckcodes }, ctx }) => await ctx.deckviews.getDeckviews(...deckcodes)),
  registerView: proc.input(z.object({ code: z.string() })).mutation(async ({ ctx, input }) => {
    const deckcode = await ctx.decklyst.unwrapCode(input.code)

    return deckcode && ctx.ipAddress
      ? ctx.deckviews.incrementViewCount(deckcode, ctx.ipAddress)
      : null
  }),
})
