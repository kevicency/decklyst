import type { DeckData } from '@/common/deckcode'
import { parseDeckcode } from '@/common/deckcode'
import { createContext, useContext } from 'react'

export type Deck = DeckData & { sharecode: string | null; viewCount: number | null }

export const DeckContext = createContext<Deck>({} as Deck)
export const useDeck = () => useContext(DeckContext)

export const createDeck = (
  deckcode: string,
  { sharecode, viewCount }: { sharecode?: string | null; viewCount?: number | null },
) => ({
  ...parseDeckcode(deckcode)!,
  sharecode: sharecode ?? null,
  viewCount: viewCount ?? null,
})
