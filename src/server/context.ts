import { extendDeckimage } from '@/server/model/deckimage'
import { extendDeckinfo } from '@/server/model/deckinfo'
import { extendDeckviews } from '@/server/model/deckviews'
import type * as trpc from '@trpc/server'
import type * as trpcNext from '@trpc/server/adapters/next'
import { prisma } from './prisma'

export async function createContext(_opts?: trpcNext.CreateNextContextOptions) {
  return {
    prisma: prisma,
    deckimage: extendDeckimage(prisma.deckimage),
    deckinfo: extendDeckinfo(prisma.deckinfo),
    deckviews: extendDeckviews(prisma.deckviews),
  }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
