import { parseDeckcode, validateDeckcode } from '@/common/deckcode'
import { deckRenderUrl } from '@/common/urls'
import { createDeck } from '@/components/DeckInfograph/useDeck'
import { DECK_IMAGE_VERSION } from '@/server/model/deckimage'
import * as trpc from '@trpc/server'
import { differenceInMilliseconds } from 'date-fns'
import { Buffer } from 'node:buffer'
import { z } from 'zod'
import type { Context } from './context'

export const serverRouter = trpc
  .router<Context>()

  .query('getDeckinfo', {
    input: z.object({
      code: z.string(),
    }),
    resolve: async ({ input, ctx }) => await ctx.deckinfo.findByCode(input.code),
  })
  .mutation('ensureDeckinfo', {
    input: z.object({
      code: z.string(),
    }),
    resolve: async ({ input: { code }, ctx }) => {
      const deckinfo = await ctx.deckinfo.findByCode(code)

      if (deckinfo) return deckinfo

      const parsedDeck = validateDeckcode(code) ? parseDeckcode(code) : null

      if (parsedDeck === null) return null

      return await ctx.deckinfo.createForDeck(parsedDeck)
    },
  })

  .query('getDeckimage', {
    input: z.object({
      deckcode: z.string(),
      timeout: z.number().optional(),
    }),
    resolve: async ({ input: { deckcode, timeout }, ctx }) => {
      let isRendering = true

      while (isRendering) {
        const deckimage = await ctx.deckimage.findByDeckcode(deckcode)

        if (deckimage == null) return null
        if (deckimage.bytes && deckimage.version === DECK_IMAGE_VERSION) return deckimage.bytes

        isRendering =
          deckimage.renderedAt !== null &&
          differenceInMilliseconds(new Date(), deckimage.renderedAt) < (timeout ?? 5000)
      }

      return null
    },
  })

  .mutation('renderDeckimage', {
    input: z.object({
      deckcode: z.string(),
    }),
    resolve: async ({ input: { deckcode }, ctx }) => {
      await ctx.deckimage.startRendering(deckcode)

      let image: Buffer | null = null
      try {
        console.log('rendering deckimage for', deckcode)
        const response = await fetch(deckRenderUrl(deckcode), { method: 'POST' })

        if (response.ok) {
          const blob = await response.blob()
          image = Buffer.from(await blob.arrayBuffer())
        }
        console.log('rendering done deckimage for', deckcode)
      } catch (e) {
        console.error(e)
      }

      return await ctx.deckimage.finishRendering(deckcode, image)
    },
  })

  .query('mostViewedDecks', {
    input: z.object({
      count: z.number().gt(0),
      recent: z.boolean().optional(),
    }),
    resolve: async ({ input, ctx }) => {
      const mostViewedDeckcodes = await ctx.deckviews.mostViewed(input)

      return mostViewedDeckcodes.map(({ deckcode, viewCount }) =>
        createDeck(deckcode, { viewCount }),
      )
    },
  })
  .mutation('registerView', {
    input: z.object({
      deckcode: z.string(),
      ipAddress: z.string(),
    }),
    resolve: async ({ input: { deckcode, ipAddress }, ctx }) =>
      await ctx.deckviews.incrementViewCount(deckcode, ipAddress),
  })

export type ServerRouter = typeof serverRouter
