import { createContext } from '@/server/context'
import { serverRouter } from '@/server/router'
import * as trpcNext from '@trpc/server/adapters/next'

export default trpcNext.createNextApiHandler({
  router: serverRouter,
  createContext,
})
