import type { Deck, DeckExpanded } from '@/data/deck'
import { createDeck, expandDeck } from '@/data/deck'
import type { FC } from 'react'
import { createContext, useContext } from 'react'

const DeckContext = createContext<DeckExpanded>(expandDeck(createDeck()))

export const useDeck = () => useContext(DeckContext)
export const DeckProvider: FC<{
  deck: DeckExpanded | Deck
  meta?: DeckExpanded['meta']
  children: any
}> = ({ deck, meta, children }) => (
  <DeckContext.Provider value={'meta' in deck ? deck : expandDeck(deck, meta)}>
    {children}
  </DeckContext.Provider>
)
