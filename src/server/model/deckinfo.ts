import { validateDeckcode } from '@/data/deckcode'
import type { PrismaClient } from '@prisma/client'
import { difference } from 'lodash'
import { customAlphabet } from 'nanoid'

type Deckinfo = PrismaClient['deckinfo']

export const extendDeckinfo = (deckinfo: Deckinfo) =>
  Object.assign(deckinfo, {
    findByCode: async (code: string) =>
      await deckinfo.findFirst({
        where: { OR: [{ deckcode: code }, { sharecode: code }] },
      }),
    createForDeckcode: async (deckcode: string) => {
      const sharecode = await generateSharecode(deckinfo)
      return await deckinfo.create({
        data: { deckcode: deckcode, sharecode },
      })
    },
    ensureDeckinfo: async (code: string) => {
      const existingDeckinfo = await deckinfo.findFirst({
        where: { OR: [{ deckcode: code }, { sharecode: code }] },
      })

      if (existingDeckinfo) return existingDeckinfo

      return validateDeckcode(code)
        ? await deckinfo.create({
            data: { deckcode: code, sharecode: await generateSharecode(deckinfo) },
          })
        : null
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
