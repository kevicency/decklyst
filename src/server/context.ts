import { PrismaClient } from '@prisma/client'
import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'

let prisma: PrismaClient | undefined = undefined

export async function createContext(_opts?: trpcNext.CreateNextContextOptions) {
  if (process.env.VERCEL) {
    prisma ??= new PrismaClient()
  }

  return { prisma: prisma ?? new PrismaClient() }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
