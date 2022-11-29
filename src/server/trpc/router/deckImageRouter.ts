import { z } from 'zod'
import { snapshot } from '../../model/snapshot'
import { proc, router } from '../trpc'

export const deckImageRouter = router({
  get: proc
    .input(z.object({ code: z.string(), timeout: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const decklyst = await ctx.decklyst.findByCode(input.code)
      return decklyst ? ctx.deckImage.findBySharecode(decklyst.sharecode, input.timeout) : null
    }),
  ensure: proc
    .input(
      z.object({
        code: z.string(),
        forceRerender: z.boolean().optional(),
        timeout: z.number().optional(),
        renderOnly: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input: { code, forceRerender, timeout, renderOnly } }) => {
      const decklyst = await ctx.decklyst.ensureByCode(code)

      if (!decklyst) return null

      const { sharecode, deckcode } = decklyst

      let image: Buffer | null = forceRerender
        ? null
        : await ctx.deckImage.findBySharecode(sharecode, timeout ?? 25000)

      if (!image) {
        await ctx.deckImage.startRendering(sharecode, deckcode)
        try {
          image = await snapshot(sharecode)
        } catch (err) {
          image = null
          console.error('Failed to render deck image', sharecode, err)
        }
        await ctx.deckImage.finishRendering(sharecode, image)
      }

      return renderOnly ? null : image
    }),
})
