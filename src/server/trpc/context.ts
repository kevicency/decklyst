import type * as trpc from '@trpc/server'
import type { CreateNextContextOptions } from '@trpc/server/adapters/next'
import { prisma } from '../db/client'
import { extendDeckimage } from '../model/deckimage'
import { extendDeckinfo } from '../model/deckinfo'
import { extendDeckviews } from '../model/deckviews'
import { getIpAddress } from '../utils'

type CreateContextOptions = {
  ipAddress?: string
}

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://beta.create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (opts: CreateContextOptions = {}) => ({
  ...opts,
  prisma: prisma,
  deckimage: extendDeckimage(prisma.deckimage),
  deckinfo: extendDeckinfo(prisma.deckinfo),
  deckviews: extendDeckviews(prisma.deckviews),
})

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export async function createContext(opts: CreateNextContextOptions) {
  const ipAddress = getIpAddress(opts.req)

  return createContextInner({
    ipAddress,
  })
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
