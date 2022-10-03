import { t } from '../trpc'
import { deckimageRouter } from './deckimageRouter'
import { deckinfoRouter } from './deckinfoRouter'
import { decksRouter } from './decksRouter'
import { deckviewsRouter } from './deckviewsRouter'

export const appRouter = t.router({
  deckinfo: deckinfoRouter,
  deckimage: deckimageRouter,
  deckviews: deckviewsRouter,
  decks: decksRouter,
})

export type AppRouter = typeof appRouter
