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
import type { Decklyst as _Decklyst, PrismaClient, User } from '@prisma/client'
import { difference, identity } from 'lodash'
import { customAlphabet } from 'nanoid'
import type { Session } from 'next-auth'

type Deckinfo = PrismaClient['deckinfo']

export type Decklyst = _Decklyst & { author: User | null }
type DeckSettings = Partial<Pick<Decklyst, 'archetype' | 'private'>>

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
    sharecode ??= await generateSharecodeX(decklyst)
    const deckcode = deck.deckcode
    const [title = '', cardcode] = splitDeckcode(deck.deckcode)

    const data = {
      deckcode,
      title,
      cardcode,
      draft: totalCount$(deck) !== 40,
      ...settings,
    }
    const metadata = {
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
        metadata: {
          create: metadata,
        },
      },
      update: {
        ...data,
        metadata: {
          update: metadata,
        },
      },
    })
  }

  const findByCode = async (code: string, userOnly?: boolean) => {
    const candidates = await Promise.all([
      decklyst.findFirst({
        where: { OR: [{ deckcode: code, authorId: user?.id }, { sharecode: code }] },
        include: { author: true },
      }),
      user && !userOnly
        ? decklyst.findFirst({
            where: { deckcode: code, private: false },
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
      const result = await findByCode(code)

      if (result) return result

      return validateDeckcode(code) ? await upsertDeck(null, createDeck(code)) : null
    },
  })
}

export const extendDeckinfo = (deckinfo: Deckinfo) => {
  const createForDeck = async (deck: Deck) => {
    const faction = faction$(deck)
    if (!faction) return null

    const sharecode = await generateSharecode(deckinfo)
    return await deckinfo.create({
      data: {
        deckcode: deck.deckcode,
        sharecode,
        faction,
        artifactCount: artifactCount$(deck),
        minionCount: minionCount$(deck),
        spellCount: spellCount$(deck),
        totalCount: totalCount$(deck),
      },
    })
  }
  const createForDeckcode = async (deckcode: string) => createForDeck(createDeck(deckcode))
  const findByCode = async (code: string) =>
    await deckinfo.findFirst({
      where: { OR: [{ deckcode: code }, { sharecode: code }] },
    })

  return Object.assign(deckinfo, {
    createForDeck,
    createForDeckcode,
    findByCode,
    ensureByCode: async (code: string) => {
      const existingDeckinfo = await deckinfo.findFirst({
        where: { OR: [{ deckcode: code }, { sharecode: code }] },
      })

      if (existingDeckinfo) return existingDeckinfo

      return validateDeckcode(code) ? createForDeckcode(code) : null
    },
    unwrapCode: async (code: string) =>
      validateDeckcode(code) ? code : (await findByCode(code))?.deckcode ?? null,
  })
}

const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz'
const nanoid = customAlphabet(alphabet, 3)
export const generateSharecode = async (deckinfo: Deckinfo, size = 3): Promise<string> => {
  const candidates = new Array(25).fill(0).map(() => nanoid(size))
  const taken = await deckinfo.findMany({
    select: { sharecode: true },
    where: {
      sharecode: { in: candidates },
    },
  })
  const sharecode = difference(
    candidates,
    taken.map((d) => d.sharecode),
  )[0]

  return sharecode ?? (await generateSharecode(deckinfo, size + 1))
}

export const generateSharecodeX = async (
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

  return sharecode ?? (await generateSharecodeX(decklyst, size + 1))
}
