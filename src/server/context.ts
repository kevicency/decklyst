import { extendDeckimage } from '@/server/model/deckimage'
import { extendDeckinfo } from '@/server/model/deckinfo'
import { PrismaClient } from '@prisma/client'
import type * as trpc from '@trpc/server'
import type * as trpcNext from '@trpc/server/adapters/next'

let prisma: PrismaClient | undefined = undefined

export async function createContext(_opts?: trpcNext.CreateNextContextOptions) {
  prisma ??= new PrismaClient()

  return {
    prisma: prisma,
    deckimage: extendDeckimage(prisma.deckimage),
    deckinfo: extendDeckinfo(prisma.deckinfo),
  }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
