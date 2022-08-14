import { createContext } from '@/server/context'
import type { ServerRouter } from '@/server/router'
import { serverRouter } from '@/server/router'

export { type ServerRouter, serverRouter } from '@/server/router'
export { type Context, createContext } from '@/server/context'

export const createSsrClient = async () => {
  return serverRouter.createCaller(await createContext())
}
