import type { Deck } from '@/data/deck'
import {
  artifactCount$,
  createDeck,
  faction$,
  minionCount$,
  spellCount$,
  totalCount$,
} from '@/data/deck'
import { validateDeckcode } from '@/data/deckcode'
import type { PrismaClient } from '@prisma/client'
import { difference } from 'lodash'
import { customAlphabet } from 'nanoid'

type Deckinfo = PrismaClient['deckinfo']

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

  return Object.assign(deckinfo, {
    createForDeck,
    createForDeckcode,
    findByCode: async (code: string) =>
      await deckinfo.findFirst({
        where: { OR: [{ deckcode: code }, { sharecode: code }] },
      }),

    ensureDeckinfo: async (code: string) => {
      const existingDeckinfo = await deckinfo.findFirst({
        where: { OR: [{ deckcode: code }, { sharecode: code }] },
      })

      if (existingDeckinfo) return existingDeckinfo

      return validateDeckcode(code) ? createForDeckcode(code) : null
    },
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
