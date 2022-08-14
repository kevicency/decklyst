import type { DeckData } from '@/common/deckcode'
import type { PrismaClient } from '@prisma/client'
import { difference } from 'lodash'
import { customAlphabet } from 'nanoid'

type Deckinfo = PrismaClient['deckinfo']

export const extendDeckinfo = (deckinfo: Deckinfo) =>
  Object.assign(deckinfo, {
    getByDeckcode: async (deckcode: string) => await deckinfo.findUnique({ where: { deckcode } }),
    getBySharecode: async (deckcode: string) => await deckinfo.findUnique({ where: { deckcode } }),
    findByCode: async (code: string) =>
      await deckinfo.findFirst({
        where: { OR: [{ deckcode: code }, { sharecode: code }] },
      }),
    recent: async (count: number) =>
      await deckinfo.findMany({ take: count, orderBy: { createdAt: 'desc' } }),
    createForDeck: async (deck: DeckData) => {
      const sharecode = await generateSharecode(deckinfo)
      return await deckinfo.create({
        data: { deckcode: deck.deckcode, sharecode },
      })
    },
  })

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
