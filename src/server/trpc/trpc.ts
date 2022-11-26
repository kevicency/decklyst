import { transformer } from '@/common/transformer'
import { initTRPC, TRPCError } from '@trpc/server'
import type { Context } from './context'

const t = initTRPC.context<Context>().create({
  transformer,
  errorFormatter: ({ shape, error }) => {
    // eslint-disable-next-line no-console
    console.error(error)
    return shape
  },
})

export const router = t.router
export const proc = t.procedure

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

/**
 * Protected procedure
 **/
export const secureProc = t.procedure.use(isAuthed)
