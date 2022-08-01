import { createReactQueryHooks } from '@trpc/react'
import { ServerRouter } from '../server/router'

export const trpc = createReactQueryHooks<ServerRouter>()
