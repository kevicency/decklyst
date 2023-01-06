import { router } from '../trpc'
import { deckImageRouter } from './deckImageRouter'
import { decklystRouter } from './decklystRouter'
import { deckViewRouter } from './deckViewRouter'
import { deckVoteRouter } from './deckVoteRouter'
import { userProfileRouter } from './userProfileRouter'

export const appRouter = router({
  deckImage: deckImageRouter,
  deckView: deckViewRouter,
  decklyst: decklystRouter,
  userProfile: userProfileRouter,
  deckVote: deckVoteRouter,
})

export type AppRouter = typeof appRouter
