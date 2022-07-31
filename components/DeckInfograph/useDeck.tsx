import { createContext, useContext } from 'react'
import { DeckData } from '../../lib/deckcode'

export const DeckContext = createContext<DeckData>({} as DeckData)
export const useDeck = () => useContext(DeckContext)
