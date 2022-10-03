import type { Context } from '@/server/context'
import { createContext } from '@/server/context'
import { appRouter } from '@/server/routers'

export { type AppRouter, appRouter } from '@/server/routers'
export { type Context, createContext } from '@/server/context'

export const createApiClient = async (context?: Context) => {
  return appRouter.createCaller(context ?? (await createContext()))
}
