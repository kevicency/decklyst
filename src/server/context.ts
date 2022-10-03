import { extendDeckimage } from '@/server/model/deckimage'
import { extendDeckinfo } from '@/server/model/deckinfo'
import { extendDeckviews } from '@/server/model/deckviews'
import type * as trpc from '@trpc/server'
import type * as trpcNext from '@trpc/server/adapters/next'
import { prisma } from './prisma'
import { getIpAddress } from './utils'

export async function createContext(opts?: trpcNext.CreateNextContextOptions) {
  return {
    ipAddress: opts?.req ? getIpAddress(opts?.req) : undefined,
    prisma: prisma,
    deckimage: extendDeckimage(prisma.deckimage),
    deckinfo: extendDeckinfo(prisma.deckinfo),
    deckviews: extendDeckviews(prisma.deckviews),
  }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
