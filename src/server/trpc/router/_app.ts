import { router } from '../trpc'
import { deckimageRouter } from './deckimageRouter'
import { deckRouter } from './deckRouter'
import { deckviewsRouter } from './deckviewsRouter'

export const appRouter = router({
  deckimage: deckimageRouter,
  deckviews: deckviewsRouter,
  deck: deckRouter,
})

export type AppRouter = typeof appRouter
