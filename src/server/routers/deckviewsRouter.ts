import { z } from 'zod'
import { t } from '../trpc'

export const deckviewsRouter = t.router({
  get: t.procedure
    .input(z.object({ deckcodes: z.array(z.string()) }))
    .query(async ({ input: { deckcodes }, ctx }) => await ctx.deckviews.getDeckviews(...deckcodes)),
  registerView: t.procedure
    .input(z.object({ code: z.string(), ipAddress: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deckcode = await ctx.deckinfo.unwrapCode(input.code)

      return deckcode ? ctx.deckviews.incrementViewCount(deckcode, input.ipAddress) : null
    }),
})
