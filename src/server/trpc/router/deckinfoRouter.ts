import { archetypes, createDeck, faction$ } from '@/data/deck'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { proc, router, secureProc } from '../trpc'

export const deckinfoRouter = router({
  get: proc
    .input(
      z.object({
        code: z.string(),
        ensure: z.boolean().optional(),
      }),
    )
    .query(({ ctx, input }) =>
      input.ensure ? ctx.deckinfo.ensureByCode(input.code) : ctx.deckinfo.findByCode(input.code),
    ),
  ensure: proc
    .input(z.object({ code: z.string() }))
    .mutation(({ ctx, input }) => ctx.deckinfo.ensureByCode(input.code)),
})

export const decklystRouter = router({
  get: proc
    .input(
      z.object({
        code: z.string(),
        ensure: z.boolean().optional(),
        scope: z.enum(['public', 'user']).optional(),
      }),
    )
    .query(({ ctx, input }) =>
      input.ensure
        ? ctx.decklyst.ensureByCode(input.code)
        : ctx.decklyst.findByCode(input.code, input.scope === 'user'),
    ),
  ensure: proc
    .input(z.object({ code: z.string() }))
    .mutation(({ ctx, input }) => ctx.decklyst.ensureByCode(input.code)),
  upsert: secureProc
    .input(
      z.object({
        deckcode: z.string(),
        sharecode: z.string().optional(),
        archetype: z.enum(archetypes).nullable().optional(),
        private: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input: { sharecode, deckcode, ...settings } }) => {
      const deck = createDeck(deckcode)
      const faction = faction$(deck)

      if (!faction || faction === 'neutral') {
        throw new TRPCError({ message: 'Invalid deckcode', code: 'BAD_REQUEST' })
      }

      const existingDecklyst = sharecode
        ? await ctx.decklyst.findUnique({ where: { sharecode } })
        : null
      if (existingDecklyst && existingDecklyst.authorId !== ctx.session.user.id) {
        throw new TRPCError({ message: 'Unauthorized', code: 'UNAUTHORIZED' })
      }

      return await ctx.decklyst.upsertDeck(sharecode, deck, settings)
    }),
})
