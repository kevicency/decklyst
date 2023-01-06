import type * as trpc from '@trpc/server'
import type { GetServerSidePropsContext } from 'next'
import type { Session } from 'next-auth'
import { getServerAuthSession } from '../auth'
import { prisma } from '../db/client'
import type { ModelContext } from '../model/context'
import { extendDeckImage } from '../model/deckImage'
import { extendDecklyst } from '../model/decklyst'
import { extendDeckView } from '../model/deckView'
import { extendDeckVote } from '../model/deckVote'
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
export const createContextInner = async (opts: CreateContextOptions = { session: null }) => {
  const modelContext: ModelContext = { prisma, session: opts.session }
  return {
    ...opts,
    prisma,
    user: prisma.user,
    decklyst: extendDecklyst(prisma.decklyst, modelContext),
    deckImage: extendDeckImage(prisma.deckImage),
    deckView: extendDeckView(prisma.deckView, modelContext),
    deckVote: extendDeckVote(prisma.deckVote, modelContext),
  }
}

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export async function createContext(opts: Pick<GetServerSidePropsContext, 'req' | 'res'>) {
  const ipAddress = getIpAddress(opts.req)
  const session = await getServerAuthSession(opts)

  return createContextInner({
    ipAddress,
    session,
  })
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
