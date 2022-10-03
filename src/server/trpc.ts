import type { Context } from './context'
import { initTRPC } from '@trpc/server'
import { transformer } from '@/common/transformer'

export const t = initTRPC.context<Context>().create({
  transformer,
  errorFormatter: ({ shape, error }) => {
    // eslint-disable-next-line no-console
    console.error(error)
    return shape
  },
})
export const proc = t.procedure
