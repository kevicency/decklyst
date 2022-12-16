import { transformer } from '@/common/transformer'
import { createContext, createContextInner } from '@/server/trpc/context'
import { appRouter } from '@/server/trpc/router/_app'
import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next'

export { createContext, createContextInner, type Context } from '@/server/trpc/context'
export { appRouter, type AppRouter } from '@/server/trpc/router/_app'

export const createSSRClient = async ({
  req,
  res,
}: {
  req: GetServerSidePropsContext['req'] | NextApiRequest
  res: GetServerSidePropsContext['res'] | NextApiResponse
}) => {
  return appRouter.createCaller(await createContext({ req, res }))
}

export const createSSGClient = async ({
  req,
  res,
}: {
  req?: GetServerSidePropsContext['req'] | NextApiRequest
  res?: GetServerSidePropsContext['res'] | NextApiResponse
} = {}) =>
  createProxySSGHelpers({
    router: appRouter,
    ctx: req && res ? await createContext({ req, res }) : await createContextInner(),
    transformer,
  })
