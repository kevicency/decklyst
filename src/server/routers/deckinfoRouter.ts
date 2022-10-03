import { z } from 'zod'
import { t } from '../trpc'

export const deckinfoRouter = t.router({
  get: t.procedure
    .input(z.object({ code: z.string(), ensure: z.boolean().optional() }))
    .query(({ ctx, input }) =>
      input.ensure ? ctx.deckinfo.ensureByCode(input.code) : ctx.deckinfo.findByCode(input.code),
    ),
  ensure: t.procedure
    .input(z.object({ code: z.string() }))
    .mutation(({ ctx, input }) => ctx.deckinfo.ensureByCode(input.code)),
})
