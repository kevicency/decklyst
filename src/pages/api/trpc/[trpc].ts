import * as trpcNext from '@trpc/server/adapters/next'
import { createContext } from '../../../server/context'
import { serverRouter } from '../../../server/router'

export default trpcNext.createNextApiHandler({
  router: serverRouter,
  createContext,
})
