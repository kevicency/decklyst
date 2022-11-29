import type * as trpc from '@trpc/server'
import type { CreateNextContextOptions } from '@trpc/server/adapters/next'
import type { Session } from 'next-auth'
import { getServerAuthSession } from '../auth'
import { prisma } from '../db/client'
import { extendDeckImage } from '../model/deckImage'
import { extendDecklyst } from '../model/decklyst'
import { getIpAddress } from '../utils'

type CreateContextOptions = {
  session: Session | null
  ipAddress?: string
}

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://beta.create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (opts: CreateContextOptions = { session: null }) => ({
  ...opts,
  prisma,
  deckView: prisma.deckView,
  user: prisma.user,
  deckImage: extendDeckImage(prisma.deckImage),
  decklyst: extendDecklyst(prisma.decklyst, opts.session),
})

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export async function createContext(opts: CreateNextContextOptions) {
  const ipAddress = getIpAddress(opts.req)
  const session = await getServerAuthSession(opts)

  return createContextInner({
    ipAddress,
    session,
  })
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
