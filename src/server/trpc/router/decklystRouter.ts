import { factions } from '@/data/cards'
import { createDeck, faction$ } from '@/data/deck'
import { validateDeckcode } from '@/data/deckcode'
import { env } from '@/env/server.mjs'
import { Archetype, Privacy } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { proc, router, secureProc } from '../trpc'

export const decklystRouter = router({
  get: proc
    .input(
      z.object({
        code: z.string(),
        scope: z.enum(['public', 'user']).optional(),
        ssrSecret: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const isSSG = input.ssrSecret === env.SSR_SECRET

      let decklyst = await ctx.decklyst.findByCode(input.code)

      if (decklyst === null && isSSG && validateDeckcode(input.code)) {
        decklyst = await ctx.decklyst.upsertDeck(null, createDeck(input.code), {
          privacy: 'public',
        })
      }

      if (decklyst === null) {
        throw new TRPCError({ message: 'Deck not found', code: 'NOT_FOUND' })
      }

      if (decklyst?.privacy === 'private') {
        const authorized = decklyst.authorId === ctx.session?.user?.id || isSSG

        if (!authorized) {
          throw new TRPCError({ message: 'Unauthorized', code: 'UNAUTHORIZED' })
        }
      }
      return decklyst
    }),
  search: proc
    .input(
      z.object({
        limit: z.number().gt(0).lte(50).optional(),
        cursor: z.number().optional(),
        sorting: z.enum(['date:created', 'views:all', 'views:recent', 'likes:all']).optional(),
        filters: z
          .object({
            factions: z.array(z.enum(factions as [string, ...string[]])),
            cardIds: z.array(z.number().int().positive()),
            includeDrafts: z.boolean().optional(),
            includeAnonymous: z.boolean().optional(),
            includeUntitled: z.boolean().optional(),
          })
          .optional(),
      }),
    )
    .query(
      async ({
        ctx,
        input: { limit = 10, cursor: page = 0, filters = { factions: [] }, sorting },
      }) => {
        const skip = limit * page
        const cardIds = filters.cardIds ?? []

        const decklysts = await ctx.decklyst.findMany({
          include: { author: true },
          skip,
          take: limit + 1,
          where: {
            AND: [
              { privacy: 'public' },
              { draft: filters.includeDrafts ? undefined : false },
              {
                stats: {
                  AND: [
                    {
                      faction: filters.factions?.length ? { in: filters.factions } : undefined,
                    },
                    ...cardIds.map((cardId) => ({ cardCounts: { path: [`${cardId}`], gte: 1 } })),
                  ],
                },
              },
            ],
          },
          orderBy:
            sorting === 'date:created'
              ? { createdAt: 'desc' }
              : sorting === 'likes:all'
              ? { likes: 'desc' }
              : sorting === 'views:all'
              ? { views: 'desc' }
              : undefined,
        })

        const hasMore = decklysts.length === limit + 1

        return {
          hasMore,
          decklysts: decklysts.slice(0, hasMore ? -1 : undefined),
        }
      },
    ),
  // ensure: proc
  //   .input(z.object({ code: z.string(), ssrSecret: z.string().optional() }))
  //   .query(async ({ ctx, input }) => {
  //     const decklysts = await ctx.decklyst.findMany({
  //       where: { OR: [{ deckcode: input.code }, { sharecode: input.code }] },
  //       orderBy: { createdAt: 'asc' },
  //       include: { author: true },
  //     })

  //     let decklyst = decklysts.find(
  //       ({ author, privacy, sharecode }) =>
  //         author &&
  //         (privacy !== 'private' ||
  //           (sharecode === input.code && input.ssrSecret === env.SSR_SECRET)),
  //     )
  //     decklyst ??= decklysts.find((decklyst) => decklyst.privacy !== 'private')
  //     decklyst ??= validateDeckcode(input.code)
  //       ? await ctx.decklyst.upsertDeck(null, createDeck(input.code), { privacy: 'public' })
  //       : undefined

  //     return decklyst ? createDeckFromDecklyst(decklyst) : null
  //   }),
  upsert: secureProc
    .input(
      z.object({
        deckcode: z.string(),
        sharecode: z.string().optional(),
        archetype: z.nativeEnum(Archetype).nullable().optional(),
        privacy: z.nativeEnum(Privacy).optional(),
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
