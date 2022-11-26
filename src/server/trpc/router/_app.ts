import { router } from '../trpc'
import { deckimageRouter } from './deckimageRouter'
import { deckinfoRouter, decklystRouter } from './deckinfoRouter'
import { decksRouter } from './decksRouter'
import { deckviewsRouter } from './deckviewsRouter'

export const appRouter = router({
  deckinfo: deckinfoRouter,
  deckimage: deckimageRouter,
  deckviews: deckviewsRouter,
  decks: decksRouter,
  decklyst: decklystRouter,
})

export type AppRouter = typeof appRouter
