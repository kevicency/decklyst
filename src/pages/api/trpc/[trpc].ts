import { appRouter, createContext } from '@/server'
import * as trpcNext from '@trpc/server/adapters/next'

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  batching: {
    enabled: true,
  },
})
