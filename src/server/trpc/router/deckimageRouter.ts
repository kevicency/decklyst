import { z } from 'zod'
import { snapshot } from '../../model/snapshot'
import { proc, router } from '../trpc'

export const deckimageRouter = router({
  get: proc
    .input(z.object({ code: z.string(), timeout: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const deckcode = await ctx.deckinfo.unwrapCode(input.code)
      return deckcode ? ctx.deckimage.findByDeckcode(deckcode, input.timeout) : null
    }),
  ensure: proc
    .input(
      z.object({
        code: z.string(),
        forceRerender: z.boolean().optional(),
        timeout: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input: { code, forceRerender, timeout } }) => {
      const { deckcode } = (await ctx.deckinfo.ensureByCode(code)) ?? { deckcode: null }

      if (!deckcode) return null

      let image: Buffer | null = forceRerender
        ? null
        : await ctx.deckimage.findByDeckcode(deckcode, timeout ?? 25000)

      if (image) return image

      await ctx.deckimage.startRendering(deckcode)
      try {
        image = await snapshot(deckcode)
      } catch (err) {
        image = null
        console.error('Failed to render deck image', deckcode, err)
      }
      await ctx.deckimage.finishRendering(deckcode, image)

      return image
    }),
})
