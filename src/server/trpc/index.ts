import type { Context } from './context'
import { createContextInner } from './context'
import { appRouter } from './router/_app'

export { createContext, createContextInner, type Context } from './context'
export { appRouter, type AppRouter } from './router/_app'

export const createApiClient = async (context?: Context) => {
  return appRouter.createCaller(context ?? (await createContextInner()))
}
