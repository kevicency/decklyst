import type { Deck } from '@/data/deck'
import {
  artifactCount$,
  createDeck,
  faction$,
  minionCount$,
  spellCount$,
  spiritCost$,
  totalCount$,
} from '@/data/deck'
import { splitDeckcode, validateDeckcode } from '@/data/deckcode'
import type { Decklyst, PrismaClient } from '@prisma/client'
import { difference, identity } from 'lodash'
import { customAlphabet } from 'nanoid'
import type { Session } from 'next-auth'

export type DeckSettings = Partial<Pick<Decklyst, 'archetype' | 'privacy' | 'views'>>

export const extendDecklyst = (
  decklyst: PrismaClient['decklyst'],
  session: Session | null = null,
) => {
  const user = session?.user

  const upsertDeck = async (
    sharecode: string | undefined | null,
    deck: Deck,
    settings: DeckSettings = {},
  ) => {
    sharecode ??= await generateSharecode(decklyst)
    const deckcode = deck.deckcode
    const [title = '', cardcode] = splitDeckcode(deck.deckcode)

    const existingDecklyst = await decklyst.findUnique({
      where: { sharecode },
    })
    const hasCardChanges = existingDecklyst && existingDecklyst.cardcode !== cardcode

    const data = {
      deckcode,
      title,
      cardcode,
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

    return await decklyst.upsert({
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
        history: hasCardChanges
          ? {
              create: {
                version: existingDecklyst.version,
                deckcode: existingDecklyst.deckcode,
              },
            }
          : undefined,
      },
    })
  }

  const findByCode = async (code: string, userOnly?: boolean) => {
    const candidates = await Promise.all([
      decklyst.findFirst({
        where: { OR: [{ deckcode: code }, { sharecode: code }], authorId: user?.id },
        include: { author: true },
      }),
      user && !userOnly
        ? decklyst.findFirst({
            where: { OR: [{ deckcode: code }, { sharecode: code }], privacy: { not: 'private' } },
            orderBy: { createdAt: 'asc' },
            include: { author: true },
          })
        : null,
    ])
    return candidates.find(identity) ?? null
  }

  return Object.assign(decklyst, {
    upsertDeck,
    findByCode,
    ensureByCode: async (code: string) => {
      let decklyst = await findByCode(code)

      if (!decklyst) {
        decklyst = validateDeckcode(code) ? await upsertDeck(null, createDeck(code)) : null
      }

      return decklyst
    },
    unwrapCode: async (code: string) =>
      validateDeckcode(code) ? code : (await findByCode(code))?.deckcode ?? null,
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
