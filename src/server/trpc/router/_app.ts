import { router } from '../trpc'
import { deckimageRouter } from './deckimageRouter'
import { decklystRouter } from './decklystRouter'
import { deckViewRouter } from './deckViewRouter'

export const appRouter = router({
  deckimage: deckimageRouter,
  deckView: deckViewRouter,
  decklyst: decklystRouter,
})

export type AppRouter = typeof appRouter
