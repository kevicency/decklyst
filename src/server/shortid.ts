import type { Context } from '@/server/context'
import { difference } from 'lodash'
import { customAlphabet } from 'nanoid'

const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz'
const nanoid = customAlphabet(alphabet, 3)

export const generateShortid = async (ctx: Context, size = 3): Promise<string> => {
  const candidates = new Array(15).fill(0).map(() => nanoid(size))
  const taken = await ctx.prisma.deck.findMany({
    select: { shortid: true },
    where: {
      shortid: { in: candidates },
    },
  })
  const shortid = difference(
    candidates,
    taken.map((d) => d.shortid),
  )[0]

  return shortid ?? (await generateShortid(ctx, size + 1))
}
