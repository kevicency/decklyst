import type { DeckData } from '@/common/deckcode'
import { createContext, useContext } from 'react'

export const DeckContext = createContext<DeckData>({} as DeckData)
export const useDeck = () => useContext(DeckContext)
