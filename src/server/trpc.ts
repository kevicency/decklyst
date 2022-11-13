import { transformer } from '@/common/transformer'
import { initTRPC } from '@trpc/server'
import type { Context } from './context'

export const t = initTRPC.context<Context>().create({
  transformer,
  errorFormatter: ({ shape, error }) => {
    // eslint-disable-next-line no-console
    console.error(error)
    return shape
  },
})

export const proc = t.procedure
