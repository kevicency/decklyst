import type { DeckData } from '@/common/deckcode'
import { createContext, useContext } from 'react'

export type Deck = DeckData & { sharecode: string | null }

export const DeckContext = createContext<Deck>({} as Deck)
export const useDeck = () => useContext(DeckContext)
