import type { Deck, DeckExpanded } from '@/data/deck'
import { createDeck, expandDeck, isDeckExpanded } from '@/data/deck'
import type { FC } from 'react'
import { createContext, useContext, useMemo } from 'react'

const DeckContext = createContext<DeckExpanded>(expandDeck(createDeck()))

export const useDeck = () => useContext(DeckContext)
export const DeckProvider: FC<{
  deck: DeckExpanded | Deck
  meta?: DeckExpanded['meta']
  children: any
}> = ({ deck, meta, children }) => {
  const value = useMemo(() => (isDeckExpanded(deck) ? deck : expandDeck(deck, meta)), [deck, meta])

  return <DeckContext.Provider value={value}>{children}</DeckContext.Provider>
}
