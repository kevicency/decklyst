import type { PrismaClient } from '@prisma/client'
import type { ModelContext } from './context'

export const extendDeckVote = (deckVote: PrismaClient['deckVote'], _ctx: ModelContext) => {
  return Object.assign(deckVote, {})
}
