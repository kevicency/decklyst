import type { Context } from '@/server/trpc/context'
import { createContextInner } from '@/server/trpc/context'
import { appRouter } from '@/server/trpc/router/_app'

export { createContext, createContextInner, type Context } from '@/server/trpc/context'
export { appRouter, type AppRouter } from '@/server/trpc/router/_app'

export const createApiClient = async (context?: Context) => {
  return appRouter.createCaller(context ?? (await createContextInner()))
}
