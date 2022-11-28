import { router } from '../trpc'
import { deckimageRouter } from './deckimageRouter'
import { decklystRouter } from './decklystRouter'
import { deckViewRouter } from './deckViewRouter'
import { userProfileRouter } from './userProfileRouter'

export const appRouter = router({
  deckimage: deckimageRouter,
  deckView: deckViewRouter,
  decklyst: decklystRouter,
  userProfile: userProfileRouter,
})

export type AppRouter = typeof appRouter
