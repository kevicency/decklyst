import { z } from 'zod'
import { proc, router } from '../trpc'

export const deckinfoRouter = router({
  get: proc
    .input(z.object({ code: z.string(), ensure: z.boolean().optional() }))
    .query(({ ctx, input }) =>
      input.ensure ? ctx.deckinfo.ensureByCode(input.code) : ctx.deckinfo.findByCode(input.code),
    ),
  ensure: proc
    .input(z.object({ code: z.string() }))
    .mutation(({ ctx, input }) => ctx.deckinfo.ensureByCode(input.code)),
})
