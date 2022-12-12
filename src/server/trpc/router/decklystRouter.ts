import { factions } from '@/data/cards'
import { createDeck, createDeckExpanded } from '@/data/deck'
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

      if (decklyst === null && isSSG) {
        const deck = validateDeckcode(input.code) ? createDeckExpanded(input.code) : null
        if (deck?.valid) {
          decklyst = await ctx.decklyst.upsertDeck(null, createDeck(input.code), {
            privacy: 'public',
          })
        } else {
          throw new TRPCError({
            message: 'Invalid deckcode',
            code: 'BAD_REQUEST',
            cause: input.code,
          })
        }
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
        sorting: z
          .enum(['date:created', 'date:updated', 'views:all', 'views:recent', 'likes:all'])
          .optional(),
        filters: z
          .object({
            factions: z.array(z.enum(factions as [string, ...string[]])).optional(),
            cardIds: z.array(z.number().int().positive()).optional(),
            tags: z.array(z.string()).optional(),
            includeDrafts: z.boolean().optional(),
            includeAnonymous: z.boolean().optional(),
            includeUntitled: z.boolean().optional(),
            authorId: z.string().optional(),
          })
          .optional(),
      }),
    )
    .query(
      async ({
        ctx,
        input: {
          limit = 10,
          cursor: page = 0,
          filters: { factions = [], tags = [], cardIds = [], ...filters } = {},
          sorting,
        },
      }) => {
        const isMyProfileSearch = filters.authorId && filters.authorId === ctx.session?.user?.id
        const skip = limit * page
        const take = limit + 1

        const where: Prisma.DecklystWhereInput = {
          AND: [
            { privacy: isMyProfileSearch ? undefined : 'public' },
            { draft: filters.includeDrafts ? undefined : false },
            { title: filters.includeUntitled ? undefined : { not: '' } },
            {
              authorId: filters.authorId ?? (filters.includeAnonymous ? undefined : { not: null }),
            },
            {
              stats: {
                AND: [
                  {
                    faction: factions?.length ? { in: factions } : undefined,
                  },
                  ...cardIds.map((cardId) => ({ cardCounts: { path: [`${cardId}`], gte: 1 } })),
                ],
              },
            },
            { tags: tags.length ? { hasEvery: tags } : undefined },
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
          case 'date:updated':
            decklysts = await ctx.decklyst.findMany({
              include,
              skip,
              take,
              where,
              orderBy: { updatedAt: 'desc' },
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
      const deck = createDeckExpanded(deckcode)

      if (!deck.valid || !deck.deckcode) {
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
  delete: secureProc
    .input(z.object({ sharecode: z.string() }))
    .mutation(async ({ ctx, input: { sharecode } }) => {
      const decklyst = await ctx.decklyst.findUnique({ where: { sharecode } })
      if (!decklyst) {
        throw new TRPCError({ message: 'Not found', code: 'NOT_FOUND' })
      }
      if (decklyst.authorId !== ctx.session.user.id) {
        throw new TRPCError({ message: 'Unauthorized', code: 'UNAUTHORIZED' })
      }
      await ctx.decklyst.delete({ where: { sharecode } })
      return true
    }),
})
