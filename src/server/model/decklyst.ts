import type { Deck } from '@/data/deck'
import {
  artifactCount$,
  createDeck,
  deckcodeNormalized$,
  faction$,
  minionCount$,
  spellCount$,
  spiritCost$,
  title$,
  totalCount$,
} from '@/data/deck'
import { validateDeckcode } from '@/data/deckcode'
import type { Decklyst, PrismaClient } from '@prisma/client'
import { difference, identity } from 'lodash'
import { customAlphabet } from 'nanoid'
import type { ModelContext } from './context'

export type DeckSettings = Partial<Pick<Decklyst, 'archetype' | 'privacy' | 'views' | 'tags'>>

export const extendDecklyst = (decklyst: PrismaClient['decklyst'], ctx: ModelContext) => {
  const user = ctx.session?.user

  const upsertDeck = async (
    sharecode: string | undefined | null,
    deck: Deck,
    settings: DeckSettings = {},
  ) => {
    const deckcode = deck.deckcode
    let existingDecklyst: Decklyst | null = null
    if (sharecode) {
      existingDecklyst ??= await decklyst.findUnique({
        where: { sharecode },
      })
    } else {
      existingDecklyst ??= await decklyst.findFirst({
        where: { deckcode, authorId: user?.id ?? null },
        orderBy: { createdAt: 'asc' },
      })
      existingDecklyst ??= user
        ? existingDecklyst
        : await decklyst.findFirst({
            where: { deckcode, privacy: { not: 'private' } },
            orderBy: { createdAt: 'asc' },
          })
    }

    sharecode = existingDecklyst?.sharecode ?? (await generateSharecode(decklyst))

    const deckcodeNormalized = deckcodeNormalized$(deck)
    const hasCardChanges = existingDecklyst
      ? existingDecklyst.deckcodeNormalized !== deckcodeNormalized
      : false

    const data = {
      deckcode,
      deckcodeNormalized,
      title: title$(deck) ?? '',
      draft: totalCount$(deck) !== 40,
      ...settings,
    }
    const stats = {
      faction: faction$(deck),
      minionCount: minionCount$(deck),
      spellCount: spellCount$(deck),
      artifactCount: artifactCount$(deck),
      totalCount: totalCount$(deck),
      spiritCost: spiritCost$(deck),
      cardCounts: Object.fromEntries(deck.cards.map((card) => [card.id, card.count])),
    }

    // if (existingDecklyst && hasCardChanges) {
    //   await ctx.prisma
    //     .$executeRaw`UPDATE "decklyst" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = '${result.id}'`
    // }

    const result = await decklyst.upsert({
      where: { sharecode },
      include: { author: true },
      create: {
        ...data,
        sharecode,
        author: user?.id ? { connect: { id: user.id } } : undefined,
        stats: {
          create: stats,
        },
      },
      update: {
        ...data,
        version: hasCardChanges ? { increment: 1 } : undefined,
        stats: {
          update: stats,
        },
        updatedAt: hasCardChanges ? new Date() : undefined,
        history: hasCardChanges
          ? {
              create: {
                version: existingDecklyst?.version ?? 1,
                deckcode,
              },
            }
          : undefined,
      },
    })

    return result
  }

  const findByDeckcode = async (deckcode: string, onlyUserDecklysts: boolean = false) => {
    const candidates = await Promise.all([
      user
        ? decklyst.findFirst({
            where: { deckcode, authorId: user?.id },
            include: { author: true },
          })
        : null,
      !onlyUserDecklysts
        ? decklyst.findFirst({
            where: { deckcode, privacy: 'public' },
            orderBy: { createdAt: 'asc' },
            include: { author: true },
          })
        : null,
    ])
    return candidates.find(identity) ?? null
  }

  const findByCode = async (code: string, userOnly: boolean = false) => {
    var queries = [
      // prioritize decklysts of current user
      async () =>
        user
          ? await decklyst.findFirst({
              where: { OR: [{ deckcode: code }, { sharecode: code }], authorId: user?.id },
              orderBy: { createdAt: 'asc' },
              include: { author: true },
            })
          : null,
      // then search for public decklysts if not user only query
      async () =>
        !userOnly
          ? await decklyst.findFirst({
              where: {
                OR: [{ deckcode: code }, { sharecode: code }],
                privacy: { not: 'private' },
              },
              orderBy: { createdAt: 'asc' },
              include: { author: true },
            })
          : null,
      // then search for decklysts with same normalized deckcode
      async () => {
        const deck = validateDeckcode(code) ? createDeck(code) : null
        return deck && !deck.title
          ? await decklyst.findFirst({
              where: { deckcodeNormalized: deckcodeNormalized$(deck) },
              orderBy: { createdAt: 'asc' },
              include: { author: true },
            })
          : null
      },
    ]

    for (const query of queries) {
      const result = await query()
      if (result) {
        return result
      }
    }

    return null
  }

  return Object.assign(decklyst, {
    upsertDeck,
    findByCode,
    findByDeckcode,
    ensureByCode: async (code: string) => {
      let decklyst = await findByCode(code)

      if (decklyst === null && validateDeckcode(code)) {
        decklyst = await upsertDeck(null, createDeck(code), {
          privacy: 'public',
        })
      }

      return decklyst
    },
  })
}

const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz'
const nanoid = customAlphabet(alphabet, 3)
export const generateSharecode = async (
  decklyst: PrismaClient['decklyst'],
  size = 3,
): Promise<string> => {
  const candidates = new Array(25).fill(0).map(() => nanoid(size))
  const taken = await decklyst.findMany({
    select: { sharecode: true },
    where: {
      sharecode: { in: candidates },
    },
  })
  const sharecode = difference(
    candidates,
    taken.map((d) => d.sharecode),
  )[0]

  return sharecode ?? (await generateSharecode(decklyst, size + 1))
}
