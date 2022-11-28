import { transformer } from '@/common/transformer'
import type { Context } from '@/server/trpc/context'
import { createContextInner } from '@/server/trpc/context'
import { appRouter } from '@/server/trpc/router/_app'
import { createProxySSGHelpers } from '@trpc/react-query/ssg'

export { createContext, createContextInner, type Context } from '@/server/trpc/context'
export { appRouter, type AppRouter } from '@/server/trpc/router/_app'

export const createApiClient = async (context?: Context) => {
  return appRouter.createCaller(context ?? (await createContextInner()))
}

export const createSSGClient = async () =>
  createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner(),
    transformer,
  })
