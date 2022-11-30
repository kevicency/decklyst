import { factions } from '@/data/cards'
import { createDeck, faction$ } from '@/data/deck'
import { validateDeckcode } from '@/data/deckcode'
import { env } from '@/env/server.mjs'
import type { Decklyst, Prisma, User } from '@prisma/client'
import { Archetype, Privacy } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { isEqual, sortBy } from 'lodash'
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

      let decklyst = await ctx.decklyst.findByCode(input.code, input.scope === 'user')

      if (decklyst === null && isSSG && validateDeckcode(input.code)) {
        decklyst = await ctx.decklyst.upsertDeck(null, createDeck(input.code), {
          privacy: 'public',
        })
      }

      // if (decklyst === null) {
      //   throw new TRPCError({ message: 'Deck not found', code: 'NOT_FOUND' })
      // }

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
        const take = limit + 1
        const cardIds = filters.cardIds ?? []

        const where: Prisma.DecklystWhereInput = {
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
        }
        const include = { author: true }

        let decklysts: Array<Decklyst & { author: User | null }> = []

        switch (sorting) {
          case 'date:created':
            decklysts = await ctx.decklyst.findMany({
              include,
              skip,
              take,
              where,
              orderBy: { createdAt: 'desc' },
            })
            break
          case 'views:all':
            decklysts = await ctx.decklyst.findMany({
              include,
              skip,
              take,
              where,
              orderBy: { views: 'desc' },
            })
            break
          case 'views:recent': {
            const mostViewed = await ctx.deckView.mostViewed({
              sinceDaysAgo: 7,
              skip,
              take,
              decklystFilter: where,
            })
            decklysts = await ctx.decklyst.findMany({
              include,
              where: { sharecode: { in: mostViewed.map(({ sharecode }) => sharecode) } },
            })
            decklysts = sortBy(decklysts, (decklyst) =>
              mostViewed.findIndex(({ sharecode }) => sharecode === decklyst.sharecode),
            )
            break
          }
          default:
            break
        }

        return {
          hasMore: decklysts.length === take,
          decklysts: decklysts.slice(0, limit),
        }
      },
    ),
  upsert: secureProc
    .input(
      z.object({
        deckcode: z.string(),
        sharecode: z.string().optional(),
        archetype: z.nativeEnum(Archetype).nullable().optional(),
        privacy: z.nativeEnum(Privacy).optional(),
        tags: z.array(z.string()).optional(),
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

      const decklyst = await ctx.decklyst.upsertDeck(sharecode, deck, settings)

      if (
        existingDecklyst &&
        (existingDecklyst.deckcode !== decklyst.deckcode ||
          existingDecklyst.archetype !== decklyst.archetype ||
          !isEqual(existingDecklyst?.tags, decklyst.tags))
      ) {
        await ctx.deckImage.deleteMany({ where: { sharecode: decklyst.sharecode } })
      }

      return decklyst
    }),
})
