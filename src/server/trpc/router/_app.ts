import { router } from '../trpc'
import { deckimageRouter } from './deckimageRouter'
import { deckRouter } from './deckRouter'
import { deckViewRouter } from './deckViewRouter'

export const appRouter = router({
  deckimage: deckimageRouter,
  deckView: deckViewRouter,
  deck: deckRouter,
})

export type AppRouter = typeof appRouter
