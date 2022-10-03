import { z } from 'zod'
import { t } from '../trpc'

export const deckinfoRouter = t.router({
  get: t.procedure
    .input(z.object({ code: z.string() }))
    .query(({ ctx, input }) => ctx.deckinfo.findByCode(input.code)),
  ensure: t.procedure
    .input(z.object({ code: z.string() }))
    .mutation(({ ctx, input }) => ctx.deckinfo.ensureByCode(input.code)),
})
